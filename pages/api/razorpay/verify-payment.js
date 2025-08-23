// pages/api/razorpay/verify-payment.js
import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * API Route: Verify Razorpay Payment
 *
 * Responsibilities:
 * 1. Validate request method and origin (CSRF protection).
 * 2. Enforce rate limits to prevent brute-force attacks.
 * 3. Authenticate the user with NextAuth.
 * 4. Verify Razorpay payment signature (HMAC SHA256).
 * 5. Update the order status in the database.
 * 6. Respond with appropriate success or failure status.
 */
export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // CSRF protection via allowed origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (ALLOWED_ORIGIN) {
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
    if (!normalizedOrigin.startsWith(normalizedAllowed)) {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }

  // Apply rate limiting
  await rateLimit(req, res, { key: "verify", points: 20, duration: 60 });

  // Authenticate user
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract required fields
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Ensure DB connection
  await dbConnect();

  // Find matching order for the user
  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
    userId: session.user.id,
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.paymentStatus === "paid") {
    return res.json({ status: "success" });
  }

  /**
   * Signature Verification:
   * Generate HMAC SHA256 hash of "order_id|payment_id"
   * and compare with the provided signature.
   */
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "failed";
    order.orderHistory.push({
      status: "payment_failed",
      note: "Signature verification failed",
      updatedBy: "system",
    });
    await order.save();

    return res.status(400).json({ status: "failed", error: "Invalid signature" });
  }

  /**
   * Update order as paid
   * Save payment details for future reconciliation.
   */
  order.paymentId = razorpay_payment_id;
  order.signature = razorpay_signature;
  order.paymentStatus = "paid";
  order.paymentDetails = {
    transactionId: razorpay_payment_id,
    paymentGateway: "razorpay",
    paymentDate: new Date(),
    method: method || "unknown", // Razorpay sends this in webhooks; optional here
  };
  order.orderHistory.push({
    status: "confirmed",
    note: "Payment verified",
    updatedBy: "system",
  });

  await order.save();

  // TODO: trigger side effects like reducing inventory, sending confirmation email, creating shipment, etc.

  return res.status(200).json({ status: "success" });
}