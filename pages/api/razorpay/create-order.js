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

    await rateLimit(req, res, { key: "createorder", points: 10, duration: 60 }); // 10 req/min

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { products: clientProducts, promocode: rawPromo, addressId } = req.body || {};
    const promocode = sanitizePromo(rawPromo);
    const productsInput = sanitizeProducts(clientProducts);

    await dbConnect();

    // Build items from DB (server-trusted)
    const items = [];
    if (productsInput && productsInput.length) {
        for (const { productId, quantity } of productsInput) {
            const p = await Product.findById(productId).lean();
            if (!p || p.deleted) return res.status(400).json({ error: "Invalid product" });
            const unitPrice = Math.ceil(p.price - (p.discountPercentage || 0) / 100 * p.price);
            items.push({
                productId: String(p._id),
                name: p.name,
                imageUrl: p.imageUrl?.[0] || "",
                price: unitPrice,
                quantity: Math.max(1, Number(quantity || 1)),
            });
        }
    } else {
        return res.status(400).json({ error: "No products supplied" });
    }

    const beforeTaxAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const { discountValue } = await validatePromo(promocode, beforeTaxAmount, session.user.id);
    const taxableBase = Math.max(0, beforeTaxAmount - discountValue);
    const taxedAmount = Math.round(taxableBase * 0.18);
    const deliveryCharges = taxableBase > 999 ? 0 : 49;
    const finalAmount = taxableBase + taxedAmount + deliveryCharges;

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
        amount: finalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            userId: session.user.id,
            addressId: addressId || "",
            promocode: promocode || "",
        },
    });

    // Persist a pending order
    await Order.create({
        userId: session.user.id,
        items,
        amounts: {
            beforeTaxAmount,
            discount: discountValue,
            taxedAmount,
            deliveryCharges,
            finalAmount,
        },
        addressId: addressId || null,
        razorpayOrderId: order.id,
        status: "pending",
    });

    res.json(order);
}
