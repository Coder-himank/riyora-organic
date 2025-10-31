// pages/api/secure/checkout.js
import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import User from "@/server/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";

const GST_RATE = 0.18; // 18% GST

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await dbConnect();

    // ===== Rate limit per IP/session =====
    await rateLimit(req, res, { key: "checkout", points: 30, duration: 60 });

    // ===== Authentication =====
    const session = await getServerSession(req, res, authOptions);
    const isGuest = !session?.user?.id;

    // ===== Input sanitization =====
    const { products: clientProducts, promocode: rawPromo, addressId, phone } = req.body || {};

    if (!clientProducts || !Array.isArray(clientProducts) || clientProducts.length === 0) {
      return res.status(400).json({ error: "No products supplied." });
    }

    const promoCode = sanitizePromo(rawPromo);
    const sanitizedProducts = sanitizeProducts(clientProducts);

    if (!sanitizedProducts.length) return res.status(400).json({ error: "Invalid products." });

    // ===== Resolve verified products from DB =====
    const items = [];

    for (const { productId, variantId, quantity } of sanitizedProducts) {
      const product = await Product.findById(productId).lean();
      if (!product || product.deleted) return res.status(400).json({ error: `Invalid product: ${productId}` });

      let variant = null;
      if (variantId && String(variantId) !== String(productId)) {
        variant = product.variants?.find((v) => String(v._id) === String(variantId));
        if (!variant) return res.status(400).json({ error: `Invalid variant for product ${productId}` });
      }

      const safeQuantity = Math.max(1, Number(quantity || 1));
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

    // ===== Price calculation =====
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

    const productDiscount = totals.totalMrp - totals.totalPrice;

    // ===== Promo validation (isolated by user or guest) =====
    const userIdForPromo = session?.user?.id ?? "guest_" + (phone ?? "unknown");
    const { discountValue: promoDiscount } = await validatePromo(promoCode, totals.totalMrp, userIdForPromo);
    const totalDiscount = productDiscount + promoDiscount;
    const taxedAmount = totals.totalPrice - totals.beforeTaxAmount;

    // Delivery charge logic
    const deliveryCharges = totals.totalPrice >= 999 ? 0 : 49;

    // Final totals
    const finalAmount = totals.totalPrice - promoDiscount;
    const totalAmount = totals.totalPrice + deliveryCharges;

    // ===== Respond with full checkout summary =====
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
      isGuest,
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
