import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const origin = req.headers.origin || req.headers.referer || "";
  if (ALLOWED_ORIGIN) {
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
    if (!normalizedOrigin.startsWith(normalizedAllowed)) {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }

  await rateLimit(req, res, { key: "verify", points: 20, duration: 60 }); // 20 req/min

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await dbConnect();

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: session.user.id });
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.status === "paid") return res.json({ status: "success" });

  // Verify signature (HMAC SHA256 of order_id|payment_id)
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ status: "failed", error: "Invalid signature" });
  }

  order.status = "paid";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paidAt = new Date();
  await order.save();

  // TODO: reduce inventory, send emails, create shipment, etc.

  res.json({ status: "success" });
}
