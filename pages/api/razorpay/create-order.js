// pages/api/razorpay/create-order.js
import Razorpay from "razorpay";
import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";
import { type } from "os";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Razorpay client instance configured with keys from environment
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * API Route: Create Razorpay Order
 *
 * Responsibilities:
 * 1. Validate request method and origin (CSRF protection).
 * 2. Enforce rate limits to prevent abuse.
 * 3. Authenticate user with NextAuth session.
 * 4. Validate and sanitize products input and optional promo code.
 * 5. Calculate subtotal, discounts, tax, shipping, and final total.
 * 6. Create an order in Razorpay and persist a pending order in DB.
 * 7. Respond with Razorpay order details.
 */
export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // Origin check to mitigate CSRF or unauthorized requests
  const origin = req.headers.origin || req.headers.referer || "";
  if (ALLOWED_ORIGIN) {
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
    if (!normalizedOrigin.startsWith(normalizedAllowed)) {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }

  // Apply rate limiting
  await rateLimit(req, res, { key: "createorder", points: 10, duration: 60 });

  // Authenticate user
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract and sanitize request body
  const { products: clientProducts, promocode: rawPromo, deliveryAddress } = req.body || {};
  const promocode = sanitizePromo(rawPromo);
  const productsInput = sanitizeProducts(clientProducts);

  // Ensure DB connection
  await dbConnect();

  /**
   * Build trusted product list:
   * - Validate product existence
   * - Apply discounts
   * - Ensure safe quantity
   */
  const products = [];
  if (productsInput && productsInput.length) {
    for (const { productId, quantity } of productsInput) {
      const product = await Product.findById(productId).lean();
      if (!product || product.deleted) {
        return res.status(400).json({ error: "Invalid product" });
      }

      const unitPrice =product.price

      products.push({
        productId: product._id,
        name: product.name,
        imageUrl: product.imageUrl?.[0] || "",
        price: unitPrice,
        quantity: Math.max(1, Number(quantity || 1)),
        sku: product.sku || null,
      });
    }
  } else {
    return res.status(400).json({ error: "No products supplied" });
  }

  /**
   * Pricing Calculations
   */
  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { discountValue } = await validatePromo(promocode, subtotal, session.user.id);

  const taxableBase = Math.max(0, subtotal - discountValue);
  const tax = Math.round(taxableBase * 0.18);
  const shipping = taxableBase > 999 ? 0 : 49;
  const total = taxableBase + tax + shipping;

  /**
   * Create Razorpay Order (amount in paise)
   */
  const rpOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      promocode: promocode || "",
    },
  });

  /**
   * Persist pending order in DB
   */
  const od = await Order.create({
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
    address: {
      name : deliveryAddress.name,
      phone : deliveryAddress.phone,
      email : deliveryAddress.email,
      label : deliveryAddress.label,
      address: deliveryAddress.address,
      state:"",
      city : deliveryAddress.city,
      country : deliveryAddress.country,
      pincode : deliveryAddress.pincode
    }, // snapshot of address
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

  // // console.log("Order persisted:", od);
  
  // const checkOd = await Order.findOne({razorpayOrderId: rpOrder.id});
  // console.log("Check Order persisted:", checkOd);

  // Respond with Razorpay order
  
  return res.status(200).json(rpOrder);
}