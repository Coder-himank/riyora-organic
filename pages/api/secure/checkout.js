// pages/api/secure/checkout.js

import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import User from "@/server/models/User";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "";
const GST_RATE = 0.18; // example 18% GST

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed." });
  }

  try {
    /** Step 1: Verify request origin (CSRF protection) */
    const origin = req.headers.origin || req.headers.referer || "";
    if (ALLOWED_ORIGIN) {
      const normalizedOrigin = origin.replace(/\/$/, "");
      const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
      if (!normalizedOrigin.startsWith(normalizedAllowed)) {
        return res.status(403).json({ error: "Invalid origin." });
      }
    }

    /** Step 2: Apply rate-limit (30 req/min per user/session key) */
    await rateLimit(req, res, { key: "checkout", points: 30, duration: 60 });

    /** Step 3: Authenticate session securely */
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const userId = session.user.id;
    await dbConnect();

    /** Step 4: Extract and sanitize input */
    const { products: clientProducts, promocode: rawPromo, addressId } = req.body || {};
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const promoCode = sanitizePromo(rawPromo);
    const sanitizedProducts = clientProducts
      ? sanitizeProducts(clientProducts)
      : sanitizeProducts(user.cartData);

    if (!sanitizedProducts || !sanitizedProducts.length) {
      return res.status(400).json({ error: "No products supplied." });
    }

    /** Step 5: Resolve verified products from DB */
    const items = [];

    for (const { productId, variantId, quantity } of sanitizedProducts) {
      const product = await Product.findById(productId).lean();

      if (!product || product.deleted) {
        return res.status(400).json({ error: `Invalid product: ${productId}` });
      }

      // ✅ Variant verification
      let variant = null;
      if (variantId && String(variantId) !== String(productId)) {
        variant = product.variants?.find((v) => String(v._id) === String(variantId));
        if (!variant) {
          return res.status(400).json({ error: `Invalid variant for product ${productId}` });
        }
      }

      // ✅ Ensure numeric and positive quantity
      const safeQuantity = Math.max(1, Number(quantity || 1));

      // ✅ Use server-side prices (not client data)
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
        quantity: safeQuantity,
      });
    }

    /** Step 6: Price computation (server-verified only) */
    const totals = items.reduce(
      (acc, item) => {
        const priceExTax = item.price / (1 + GST_RATE);
        const mrpExTax = item.mrp / (1 + GST_RATE);

        acc.totalPrice += item.price * item.quantity;
        acc.totalMrp += item.mrp * item.quantity;
        acc.beforeTaxAmount += priceExTax * item.quantity;

        return acc;
      },
      { totalPrice: 0, totalMrp: 0, beforeTaxAmount: 0 }
    );

    // 💰 Discounts and adjustments
    const productDiscount = totals.totalMrp - totals.totalPrice;

    // Promo validation — isolated by user
    const { discountValue: promoDiscount } = await validatePromo(
      promoCode,
      totals.totalMrp,
      userId
    );

    const totalDiscount = productDiscount + promoDiscount;
    const taxedAmount = totals.totalPrice - totals.beforeTaxAmount;

    // 🚚 Delivery charge rule (you can tweak)
    const deliveryCharges = totals.totalPrice >= 999 ? 0 : 49;

    // 🧾 Final price calculations
    const finalAmount = totals.totalPrice - promoDiscount;
    const totalAmount = totals.totalPrice + deliveryCharges;

    /** Step 7: Respond with detailed, clean breakdown */
    return res.status(200).json({
      success: true,
      products: items,
      itemTotal: Number(totals.totalPrice.toFixed(2)),
      beforeTaxAmount: Number(totals.beforeTaxAmount.toFixed(2)),
      promoDiscount: Number(promoDiscount.toFixed(2)),
      discount: Number(totalDiscount.toFixed(2)),
      taxedAmount: Number(taxedAmount.toFixed(2)),
      deliveryCharges: Number(deliveryCharges.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      finalAmount: Number(finalAmount.toFixed(2)),
      addressId: addressId || null,
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
