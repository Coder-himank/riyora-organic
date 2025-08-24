// pages/api/razorpay/webhook.js

import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";

export const config = {
  api: {
    bodyParser: false, // Required: Razorpay needs the raw request body
  },
};

/**
 * Helper: Collects raw request body into a Buffer.
 */
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

/**
 * API Route: Razorpay Webhook
 *
 * Responsibilities:
 * 1. Accept webhook events from Razorpay.
 * 2. Verify signature with HMAC SHA256.
 * 3. Parse and validate payment payload.
 * 4. Create or update order records accordingly.
 * 5. Maintain order history for traceability.
 */
export default async function handler(req, res) {
  // Enforce POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Collect raw request body (required for signature validation)
  const rawBody = await getRawBody(req);
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Compute expected signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // Secure comparison to avoid timing attacks
  if (
    !signature ||
    expectedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Parse event payload
  const event = JSON.parse(rawBody);
  const eventType = event.event;
  const payment = event?.payload?.payment?.entity;

  if (!payment) {
    console.error("Webhook error: No payment entity in payload");
    return res.status(400).send("Malformed webhook");
  }


  const notes = payment.notes || {};

  try {
    await dbConnect();

    // Attempt to locate order by Razorpay orderId
    let order = await Order.findOne({ razorpayOrderId: payment.order_id });

    // If not found, create a new order as fallback
    if (!order) {
  
      // return res.status(200).send("Order not found, webhook ignored");
      
      order = new Order({
        userId: notes.userId,
        products: notes.products ? JSON.parse(notes.products) : [],
        address: notes.address ? JSON.parse(notes.address) : {city:"lund"},
        amountBreakDown: notes.amountBreakDown
          ? JSON.parse(notes.amountBreakDown)
          : {},
        promoCode: notes.promocode || null,
        amount: payment.amount / 100, // Convert paise to INR
        currency: payment.currency,
        razorpayOrderId: payment.order_id,
        status: "pending", // Business workflow may update later
        orderHistory: [
          {
            status: "pending",
            note: "Order created via webhook",
            updatedBy: "system",
          },
        ],
      });
    }

    /**
     * Update order details based on event type
     */
    if (eventType === "payment.captured") {
      order.paymentId = payment.id;
      order.signature = signature;
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId: payment.id,
        paymentGateway: "razorpay",
        paymentDate: new Date(payment.created_at * 1000), // Unix timestamp
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

    // Save updates
    await order.save();

    return res.status(200).send("Order updated");
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).send("Internal server error");
  }
}