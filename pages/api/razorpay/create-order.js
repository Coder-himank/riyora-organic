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
import User from "@/server/models/User";

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
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

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
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user =await User.findById(session.user.id);

  const { products: clientProducts, promocode: rawPromo, deliveryAddress } = req.body || {};
  const promocode = sanitizePromo(rawPromo);
  const productsInput =  clientProducts ? sanitizeProducts(clientProducts) :sanitizeProducts(user.cartData || []); // use user's cart if no products provided

  await dbConnect();

  const products = [];
  if (productsInput && productsInput.length) {
    for (const { productId, quantity, variantId } of productsInput) { // modified for variants
      const product = await Product.findById(productId).lean();
      if (!product || product.deleted) {
        return res.status(400).json({ error: "Invalid product" });
      }

      // Determine price: use variant price if selected
      let unitPrice = product.price; // default product price
      let selectedVariant = null; // added for variants
      if (variantId && product.variants?.length) { // added for variants
        selectedVariant = product.variants.find((v) => String(v._id) === String(variantId)); // added for variants
        if (selectedVariant) {
          unitPrice = selectedVariant.price || unitPrice; // modified for variants
        }
      }

     products.push({
  productId: product._id,
  name: product.name,
  imageUrl: product.imageUrl?.[0] || "",
  price: unitPrice,
  quantity: Math.max(1, Number(quantity || 1)),
  sku: variantId
    ? product?.variants?.find(v => v._id.toString() === variantId)?.sku || product.sku || null
    : product.sku || null,
  variantId: variantId || null,
  variant: variantId
    ? product?.variants?.find(v => v._id.toString() === variantId) || null
    : null,
});

    }
  } else {
    return res.status(400).json({ error: "No products supplied" });
  }

  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { discountValue } = await validatePromo(promocode, subtotal, session.user.id);

  const taxableBase = Math.max(0, subtotal - discountValue);
  const tax = Math.round(taxableBase * 0);
  const shipping = taxableBase > 999 ? 0 : 49;
  const total = taxableBase + tax + shipping;

  const rpOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      promocode: promocode || "",
    },
  });

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
      name: deliveryAddress.name,
      phone: deliveryAddress.phone,
      email: deliveryAddress.email,
      label: deliveryAddress.label,
      address: deliveryAddress.address,
      state: "",
      city: deliveryAddress.city,
      country: deliveryAddress.country,
      pincode: deliveryAddress.pincode,
    },
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

  return res.status(200).json(rpOrder);
}
