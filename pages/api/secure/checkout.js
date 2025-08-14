import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Basic CSRF hardening (same-origin)
  const origin = req.headers.origin || req.headers.referer || "";
  if (ALLOWED_ORIGIN) {
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
    if (!normalizedOrigin.startsWith(normalizedAllowed)) {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }


  await rateLimit(req, res, { key: "checkout", points: 30, duration: 60 }); // 30 req/min

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { products: clientProducts, promocode: rawPromo, addressId } = req.body || {};
  const promocode = sanitizePromo(rawPromo);
  const productsInput = sanitizeProducts(clientProducts);

  await dbConnect();

  // If productsInput is null, use the user's cart from DB (left as TODO if you have a cart)
  const items = [];
  if (productsInput && productsInput.length) {
    for (const { productId, quantity } of productsInput) {
      const p = await Product.findById(productId).lean();
      if (!p || p.deleted) return res.status(400).json({ error: "Invalid product" });
      const price = Math.ceil(p.price - (p.discountPercentage || 0) / 100 * p.price);
      items.push({
        productId: String(p._id),
        name: p.name,
        imageUrl: p.imageUrl?.[0] || "",
        price,
        quantity: Math.max(1, Number(quantity || 1)),
      });
    }
  } else {
    // TODO: load from user's saved cart instead
    return res.status(400).json({ error: "No products supplied" });
  }

  // Calculate totals server-side
  const beforeTaxAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const { discountValue } = await validatePromo(promocode, beforeTaxAmount, session.user.id);
  const taxableBase = Math.max(0, beforeTaxAmount - discountValue);

  // Example: 18% GST
  const taxedAmount = Math.round(taxableBase * 0.18);
  // Example delivery logic
  const deliveryCharges = taxableBase > 999 ? 0 : 49;

  const finalAmount = taxableBase + taxedAmount + deliveryCharges;

  // (Optional) Return addresses to ease client UX
  // You already have an API for addresses; skipping duplication here.
  res.json({
    products: items,
    beforeTaxAmount,
    discount: discountValue,
    taxedAmount,
    deliveryCharges,
    finalAmount,
    addressId: addressId || null,
  });
}
