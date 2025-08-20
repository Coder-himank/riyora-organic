// pages/api/razorpay/webhook.js

import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";

export const config = {
  api: {
    bodyParser: false, // Razorpay requires raw body
  },
};

const buffer = (req) =>
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

  const rawBody = await buffer(req);
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (
    !signature ||
    expectedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event;
  const payment = event?.payload?.payment?.entity;

  if (!payment) {
    console.error("No payment entity found in webhook");
    return res.status(400).send("Malformed webhook");
  }

  const notes = payment.notes || {};

  try {
    await dbConnect();

    // 1. Find existing order by Razorpay orderId
    let order = await Order.findOne({ razorpayOrderId: payment.order_id });

    if (!order) {
      // 2. If not found, create a new one (fallback)
      order = new Order({
        userId: notes.userId,
        products: notes.products ? JSON.parse(notes.products) : [],
        address: notes.address ? JSON.parse(notes.address) : {},
        amountBreakDown: notes.amountBreakDown
          ? JSON.parse(notes.amountBreakDown)
          : {},
        promoCode: notes.promocode || null,
        amount: payment.amount / 100,
        currency: payment.currency,
        razorpayOrderId: payment.order_id,
        status: "pending", // workflow remains pending until seller confirms
        orderHistory: [
          {
            status: "pending",
            note: "Order created via webhook",
            updatedBy: "system",
          },
        ],
      });
    }

    // 3. Update payment fields based on event type
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
    }

    if (eventType === "payment.failed") {
      order.paymentId = payment.id;
      order.paymentStatus = "failed";
      order.orderHistory.push({
        status: "payment_failed",
        note: "Payment failed via webhook",
        updatedBy: "system",
      });
    }

    await order.save();

    return res.status(200).send("Order updated");
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).send("Internal server error");
  }
}
