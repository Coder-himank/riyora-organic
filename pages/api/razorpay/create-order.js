import Razorpay from "razorpay";
import Order from "@/server/models/Order";
import User from "@/server/models/User";
import connectDB from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { sanitizePromo, sanitizeProducts } from "@/utils/security/sanitize";
import { rateLimit } from "@/utils/security/rateLimit";

import { resolveProducts } from "@/utils/products/resolveProducts";
import { applyPromo } from "@/utils/promo/applyPromo";
import { calcDelivery } from "@/utils/checkoutHelper/calcDelivery";

import { validateOrigin, setupBase } from "@/utils/security/secureApi";
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

const razorpay = new Razorpay({
  key_id:
    process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development"
      ? process.env.RAZORPAY_TEST_KEY_ID
      : process.env.RAZORPAY_LIVE_KEY_ID,

  key_secret:
    process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development"
      ? process.env.RAZORPAY_TEST_KEY_SECRET
      : process.env.RAZORPAY_LIVE_KEY_SECRET,
});

export default async function handler(req, res) {
  validateOrigin(req, ALLOWED_ORIGIN);

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {

    await setupBase(req, res, "createorder", 10, 60);

    const session = await getServerSession(req, res, authOptions);

    const { products: clientProducts, promocode: rawPromo, deliveryAddress, phone } =
      req.body || {};

    if (!deliveryAddress?.address || !deliveryAddress?.pincode) {
      return res.status(400).json({ error: "Invalid delivery address" });
    }

    const sanitizedProducts = sanitizeProducts(clientProducts);
    const promo = sanitizePromo(rawPromo);

    if (!sanitizedProducts.length)
      return res.status(400).json({ error: "Invalid products" });

    // Resolve validated products
    const { items, totals } = await resolveProducts(sanitizedProducts);

    const {discountValue:promoDiscount} = await applyPromo(
      promo,
      totals.totalPrice,
      session,
      phone,
      items.map((item) => item.productId)
    );

    const taxableBase = Math.max(0, totals.totalPrice - promoDiscount);
    const shipping = calcDelivery(taxableBase);

    const total = taxableBase + shipping;

    if (total <= 0)
      return res.status(400).json({ error: "Invalid total amount" });

    // Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session?.user?.id || "guest",
        promo,
      },
    });

    let userId = session?.user?.id;
    if (!userId && phone) {
      const existing = await User.findOne({ phone });
      userId = existing?._id || (await User.create({ phone, name: "Guest" }))._id;
    }

    // Store order
    await Order.create({
      userId,
      products: items,
      promoCode: promo || null,
      amountBreakDown: {
        subtotal: totals.totalPrice,
        discount: promoDiscount,
        shipping,
        total,
      },
      amount: total,
      currency: "INR",
      address: deliveryAddress,
      razorpayOrderId: rpOrder.id,
      status: "pending",
      paymentStatus: "pending",
      orderHistory: [
        {
          status: "pending",
          note: "Order created",
          updatedBy: "system",
          date: new Date(),
        },
      ],
    });

    res.status(200).json({
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: "INR",
      message: "Order Created",
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
}
