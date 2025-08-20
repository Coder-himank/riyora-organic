import Razorpay from "razorpay";
import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  await rateLimit(req, res, { key: "createorder", points: 10, duration: 60 });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { products: clientProducts, promocode: rawPromo, address } = req.body || {};
  const promocode = sanitizePromo(rawPromo);
  const productsInput = sanitizeProducts(clientProducts);

  await dbConnect();

  // Build trusted items
  const products = [];
  if (productsInput && productsInput.length) {
    for (const { productId, quantity } of productsInput) {
      const p = await Product.findById(productId).lean();
      if (!p || p.deleted) return res.status(400).json({ error: "Invalid product" });

      const unitPrice = Math.ceil(p.price - (p.discountPercentage || 0) / 100 * p.price);
      products.push({
        productId: p._id,
        name: p.name,
        imageUrl: p.imageUrl?.[0] || "",
        price: unitPrice,
        quantity: Math.max(1, Number(quantity || 1)),
        sku: p.sku || null,
      });
    }
  } else {
    return res.status(400).json({ error: "No products supplied" });
  }

  // Amount calculations
  const subtotal = products.reduce((s, it) => s + it.price * it.quantity, 0);
  const { discountValue } = await validatePromo(promocode, subtotal, session.user.id);
  const taxableBase = Math.max(0, subtotal - discountValue);
  const tax = Math.round(taxableBase * 0.18);
  const shipping = taxableBase > 999 ? 0 : 49;
  const total = taxableBase + tax + shipping;

  // Create Razorpay order (amount in paise)
  const rpOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      promocode: promocode || "",
    },
  });

  // Persist pending order
  await Order.create({
    userId: session.user.id,
    products,
    promoCode: promocode || null,
    amountBreakDown: {
      subtotal,
      discount: discountValue,
      tax,
      shipping,
      total,
    },
    amount: total,
    currency: "INR",
    address: address || {}, // snapshot of address object
    razorpayOrderId: rpOrder.id,
    status: "pending",
    paymentStatus: "pending",
    orderHistory: [
      {
        status: "pending",
        note: "Order created",
        updatedBy: "system",
      },
    ],
  });

  res.json(rpOrder);
}
