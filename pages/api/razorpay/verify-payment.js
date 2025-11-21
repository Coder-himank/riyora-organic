import crypto from "crypto";
import dbConnect from "@/server/db";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { rateLimit } from "@/utils/rateLimit";
import { handleOrderAction } from "@/utils/orderHelper";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  // ✅ Origin Protection
  const origin = req.headers.origin || req.headers.referer || "";
if (ALLOWED_ORIGIN) {
    const normalize = (url) => url.replace(/\/$/, '').replace(/^https?:\/\/(www\.)?/, '');
    
    const normalizedOrigin = normalize(origin);
    const normalizedAllowed = normalize(ALLOWED_ORIGIN);

    if (normalizedOrigin !== normalizedAllowed) {
      return res.status(403).json({ 
        error: "Invalid request origin: " + normalizedAllowed + " vs " + normalizedOrigin 
      });
    }
  }
  // ✅ Rate limit
  await rateLimit(req, res, { key: "verify", points: 20, duration: 60 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment fields" });
  }

  await dbConnect();

  // ✅ Try session (if user logged in)
  let session = null;
  try {
    session = await getServerSession(req, res, authOptions);
  } catch {}

  // ✅ Fetch order with razorpay order ID only
  // Guest users have `userId` saved as demo user.
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // ✅ If logged in, user must match the order
  if (session?.user?.id && session.user.id !== order.userId?.toString()) {
    return res.status(403).json({ error: "Unauthorized user for this order" });
  }

  // ✅ If already paid
  if (order.paymentStatus === "paid") {
    return res.json({ status: "success" });
  }

  // ✅ Verify Razorpay Signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development" ?  process.env.RAZORPAY_TEST_KEY_SECRET : process.env.RAZORPAY_LIVE_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "failed";
    order.orderHistory.push({
      status: "payment_failed",
      note: "Signature mismatch",
      updatedBy: "system",
    });
    await order.save();
    return res.status(400).json({ status: "failed", error: "Invalid signature" });
  }

  // ✅ Mark order paid
  order.paymentId = razorpay_payment_id;
  order.signature = razorpay_signature;
  order.paymentStatus = "paid";
  order.paymentDetails = {
    transactionId: razorpay_payment_id,
    paymentGateway: "razorpay",
    paymentDate: new Date(),
    method: req.body.method || "card/upi",
  };
  order.orderHistory.push({
    status: "confirmed",
    note: "Payment verified",
    updatedBy: "system",
  });

  await order.save();
  

  res.json({ status: "success" });
}
