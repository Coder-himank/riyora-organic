// pages/api/secure/checkout.js

import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";

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
    /**
     * Step 1: Basic CSRF protection
     * Ensure requests only come from allowed origin.
     */
    const origin = req.headers.origin || req.headers.referer || "";
    if (ALLOWED_ORIGIN) {
      const normalizedOrigin = origin.replace(/\/$/, "");
      const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
      if (!normalizedOrigin.startsWith(normalizedAllowed)) {
        return res.status(403).json({ error: "Invalid origin" });
      }
    }

    /**
     * Step 2: Rate limiting
     * Limits this endpoint to 30 requests/minute per key.
     */
    await rateLimit(req, res, { key: "checkout", points: 30, duration: 60 });

    /**
     * Step 3: Authentication
     * Only authenticated users can proceed to checkout.
     */
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /**
     * Step 4: Extract and sanitize inputs
     */
    const { products: clientProducts, promocode: rawPromo, addressId } =
      req.body || {};
    const promocode = sanitizePromo(rawPromo);
    const productsInput = sanitizeProducts(clientProducts);

    await dbConnect();

    /**
     * Step 5: Resolve product details (with variant support)
     */
    const items = [];
    if (productsInput && productsInput.length) {
      for (const { productId, quantity, variantId } of productsInput) {
        const product = await Product.findById(productId).lean();
        if (!product || product.deleted) {
          return res.status(400).json({ error: "Invalid product" });
        }

        // added for variants → resolve variant price & name if variantId provided
        let variant = null;
        if (variantId && product.variants?.length) {
          variant = product.variants.find((v) => String(v._id) === String(variantId));
        }

        const price = variant ? variant.price : product.price;
        const name = variant ? `${product.name} - ${variant.name}` : product.name;

        items.push({
          productId: String(product._id),
          variantId: variant ? String(variant._id) : null, // added for variants
          name, // modified for variants → include variant name
          imageUrl: product.imageUrl?.[0] || "",
          price,
          quantity: Math.max(1, Number(quantity || 1)),
        });
      }
    } else {
      // TODO: Load items from user's saved cart instead of error
      return res.status(400).json({ error: "No products supplied" });
    }

    /**
     * Step 6: Pricing calculations
     */
    const beforeTaxAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const { discountValue } = await validatePromo(
      promocode,
      beforeTaxAmount,
      session.user.id
    );

    const taxableBase = Math.max(0, beforeTaxAmount - discountValue);

    // Example: 18% GST
    const taxedAmount = Math.round(taxableBase * 0.18);

    // Example delivery rule: free delivery above ₹999
    const deliveryCharges = taxableBase > 999 ? 0 : 49;

    const finalAmount = taxableBase + taxedAmount + deliveryCharges;

    /**
     * Step 7: Respond with detailed checkout breakdown
     */
    return res.json({
      products: items,
      beforeTaxAmount,
      discount: discountValue,
      taxedAmount,
      deliveryCharges,
      finalAmount,
      addressId: addressId || null,
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
