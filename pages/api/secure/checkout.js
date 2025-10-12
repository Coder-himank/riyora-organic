// pages/api/secure/checkout.js

import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";
import User from "@/server/models/User";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * API Route: Checkout Calculation
 *
 * Responsibilities:
 * - Validate request origin (basic CSRF mitigation)
 * - Rate-limit requests to prevent abuse
 * - Authenticate user session
 * - Sanitize and validate product & promo inputs
 * - Calculate final checkout breakdown (subtotal, discount, tax, delivery, total)
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    /** Step 1: Basic CSRF protection */
    const origin = req.headers.origin || req.headers.referer || "";
    if (ALLOWED_ORIGIN) {
      const normalizedOrigin = origin.replace(/\/$/, "");
      const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
      if (!normalizedOrigin.startsWith(normalizedAllowed)) {
        return res.status(403).json({ error: "Invalid origin" });
      }
    }

    /** Step 2: Rate limiting (30 req/min per key) */
    await rateLimit(req, res, { key: "checkout", points: 30, duration: 60 });

    /** Step 3: Authentication */
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /** Step 4: Extract and sanitize inputs */
    const { products: clientProducts, promocode: rawPromo, addressId } = req.body || {};
    const user = await User.findById(session.user.id);

    const promocode = sanitizePromo(rawPromo);
    const productsInput = clientProducts
      ? sanitizeProducts(clientProducts)
      : sanitizeProducts(user.cartData);

    await dbConnect();

    /** Step 5: Resolve product details (with variant support) */
    const items = [];
    if (productsInput && productsInput.length) {
      for (const { productId, quantity, variantId } of productsInput) {
        const product = await Product.findById(productId).lean();
        if (!product || product.deleted) {
          return res.status(400).json({ error: "Invalid product" });
        }

        let variant = null;
        if (variantId && product.variants?.length && variantId !== productId) {
          variant = product.variants.find((v) => String(v._id) === String(variantId));
        }

        const price = variant ? variant.price : product.price;
        const mrp = variant ? variant.mrp || product.mrp : product.mrp;
        const name = variant ? `${product.name} - ${variant.name}` : product.name;

        items.push({
          productId: String(product._id),
          variantId: variant ? String(variant._id) : null,
          name,
          imageUrl: product.imageUrl?.[0] || "",
          price,
          mrp,
          quantity: Math.max(1, Number(quantity || 1)),
        });
      }
    } else {
      return res.status(400).json({ error: "No products supplied" });
    }

    /** Step 6: Pricing calculations */
    const GST_RATE = 0.18;

    // 1️⃣ Totals
    const totals = items.reduce(
      (acc, item) => {
        const mrpBase = item.mrp / (1 + GST_RATE);
        const priceBase = item.price / (1 + GST_RATE);

        acc.totalMrp += item.mrp * item.quantity;
        acc.totalPrice += item.price * item.quantity;
        acc.beforeTaxAmount += priceBase * item.quantity;

        return acc;
      },
      { totalMrp: 0, totalPrice: 0, beforeTaxAmount: 0 }
    );

    // 2️⃣ Discount from MRP vs Price
    const productDiscount = totals.totalMrp - totals.totalPrice;

    // 3️⃣ Promo discount
    const { discountValue: promoDiscount } = await validatePromo(
      promocode,
      totals.totalMrp,
      session.user.id
    );

    // 4️⃣ Total discount
    const totalDiscount = productDiscount + promoDiscount;

    // 5️⃣ Tax amount (already included in selling price)
    const taxedAmount = totals.totalPrice - totals.beforeTaxAmount;

    // 6️⃣ Delivery charges rule
    const deliveryCharges = totals.totalPrice > 999 ? 0 : 49;

    // 7️⃣ Final amount (includes GST)
    const finalAmount = totals.totalPrice - promoDiscount + deliveryCharges;

    /** Step 7: Respond with detailed checkout breakdown */
    return res.json({
      products: items,
      beforeTaxAmount: totals.totalMrp,
      discount: totalDiscount.toFixed(2),
      taxedAmount: taxedAmount.toFixed(2),
      deliveryCharges: deliveryCharges.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      addressId: addressId || null,
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
