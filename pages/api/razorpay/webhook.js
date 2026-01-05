// pages/api/razorpay/webhook.js

import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";
import { handleOrderAction } from "@/utils/order/orderHelper";
import increasePromo from "@/utils/promo/updatePromo";
import sendMail from "@/utils/sendMail";

export const config = {
  api: {
    bodyParser: false, // Required for Razorpay webhook
  },
};

/**
 * Helper: Collect raw body
 */
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const rawBody = await getRawBody(req);

  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (
    !signature ||
    expectedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  ) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event;
  const payment = event?.payload?.payment?.entity;

  if (!payment) {
    console.error("Webhook error: No payment entity");
    return res.status(400).send("Malformed webhook");
  }

  const notes = payment.notes || {};

  try {
    await dbConnect();

    let order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (!order) {
      order = new Order({
        userId: notes.userId,
        products: notes.products
          ? JSON.parse(notes.products).map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
              variantId: p.variantId || null,
              variantName: p.variantName || null,
              price: p.price,
            }))
          : [],
        address: notes.address ? JSON.parse(notes.address) : {},
        amountBreakDown: notes.amountBreakDown
          ? JSON.parse(notes.amountBreakDown)
          : {},
        promoCode: notes.promocode || null,
        amount: payment.amount / 100,
        currency: payment.currency,
        razorpayOrderId: payment.order_id,
        status: "pending",
        orderHistory: [
          {
            status: "pending",
            note: "Order created via webhook",
            updatedBy: "system",
          },
        ],
      });
    }

    /* =============================
       PAYMENT CAPTURED
    ============================== */
    if (eventType === "payment.captured") {
      order.paymentId = payment.id;
      order.signature = signature;
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId: payment.id,
        paymentGateway: "razorpay",
        paymentDate: new Date(payment.created_at * 1000),
        method: payment.method,
      };

      order.orderHistory.push({
        status: "confirmed",
        note: "Payment captured via webhook",
        updatedBy: "system",
      });

      await increasePromo();

      try {
        console.log("Plaing orer on shiprocketafeet payemnt success");
        const result = await handleOrderAction(
          order._id.toString(),
          "create",
          { paymentGateway: "razorpay" }
        );

        if (!result) {
          console.error("External system failure");
          if (notes.email) {
            await sendMail(
              notes.email,
              "externalSystemFailure",
              notes.name || "Customer"
            );
          }
          return res.status(500).send("External system error");
        }
      } catch (err) {
        console.error("handleOrderAction error:", err);
        if (notes.email) {
          await sendMail(
            notes.email,
            "externalSystemFailure",
            notes.name || "Customer"
          );
        }
        return res.status(500).send("Internal server error");
      }

      if (notes.email) {
        await sendMail(
          notes.email,
          "orderPlaced",
          order._id.toString(),
          notes.name || "Customer"
        );
      }
    }

    /* =============================
       PAYMENT FAILED
    ============================== */
    if (eventType === "payment.failed") {
      order.paymentId = payment.id;
      order.paymentStatus = "failed";
      order.orderHistory.push({
        status: "payment_failed",
        note: "Payment failed via webhook",
        updatedBy: "system",
      });

      if (notes.email) {
        await sendMail(
          notes.email,
          "paymentFailed",
          order._id.toString(),
          notes.name || "Customer"
        );
      }
    }

    // payement cancelled
    if (eventType === "payment.cancelled") {
      order.paymentId = payment.id;
      order.paymentStatus = "cancelled";
      order.orderHistory.push({
        status: "payment_cancelled",
        note: "Payment cancelled via webhook",
        updatedBy: "system",
      });

      if (notes.email) {
        await sendMail(
          notes.email,
          "paymentFailed",
          notes.name || "Customer",
          order._id.toString(),
          // "Payment was cancelled."
        );
      }

    }
    

    await order.save();
    return res.status(200).send("Order updated");
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).send("Internal server error");
  }
}
