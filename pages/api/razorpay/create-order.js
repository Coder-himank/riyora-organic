// pages/api/secure/razorpay/create-order.js
import Razorpay from "razorpay";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";
import User from "@/server/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { validatePromo } from "@/utils/promo";
import { sanitizePromo, sanitizeProducts } from "@/utils/sanitize";
import { rateLimit } from "@/utils/rateLimit";
import connectDB from "@/server/db";
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL;

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development" ?  process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_LIVE_KEY_ID,
  key_secret: process.env.NEXT_PUBLIC_DEPLOYEMENT_MODE === "development" ?  process.env.RAZORPAY_TEST_KEY_SECRET : process.env.RAZORPAY_LIVE_KEY_SECRET,
   
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    // ===== Step 1: Verify request origin (CSRF protection) =====
    const origin = req.headers.origin || req.headers.referer || "";
  if (ALLOWED_ORIGIN) {
    const normalize = (url) => url.replace(/\/$/, '').replace(/^https?:\/\/(www\.)?/, '');
    
    const normalizedOrigin = normalize(origin);
    const normalizedAllowed = normalize(ALLOWED_ORIGIN);

    if (normalizedOrigin !== normalizedAllowed) {
      return res.status(403).json({ 
        error: "Invalid request origin: " + normalizedAllowed + " vs " + normalizedOrigin 
      });
    }
  }
    // ===== Step 2: Rate limit =====
    await rateLimit(req, res, { key: "createorder", points: 10, duration: 60 });

    // ===== Step 3: Connect DB =====
    await connectDB();
    

    // ===== Step 4: Authenticate or identify guest =====
    const session = await getServerSession(req, res, authOptions);
    const isGuest = !session?.user?.id;

    // ===== Step 5: Sanitize input =====
    const { products: clientProducts, promocode: rawPromo, deliveryAddress, phone } = req.body || {};

    if (!clientProducts || !Array.isArray(clientProducts) || clientProducts.length === 0) {
      return res.status(400).json({ error: "No products supplied" });
    }

    if (!deliveryAddress?.address || !deliveryAddress?.pincode) {
      return res.status(400).json({ error: "Invalid delivery address" });
    }

    const promocode = sanitizePromo(rawPromo);
    const sanitizedProducts = sanitizeProducts(clientProducts);

    if (!sanitizedProducts.length) return res.status(400).json({ error: "Invalid products" });

    // ===== Step 6: Verify products & variants =====
    // console.log(sanitizedProducts);
    const products = [];
    for (const { productId, quantity, variantId } of sanitizedProducts) {
      const product = await Product.findOne({
        _id: productId,
        deleted: { $ne: true },
        isVisible: { $ne: false },
      }).lean();

      if (!product) return res.status(400).json({ error: `Invalid product: ${productId}` });

      let price = product.price;
      let variantData = null;


      if (variantId && product.variants?.length) {
        
        variantData = product.variants.find((v) => String(v._id) === String(variantId));
        if (!variantData && String(product._id) !== String(variantId)) return res.status(400).json({ error: `Invalid variant for product: ${productId}` });
        price = variantData?.price || product.price;
      }

      products.push({
        productId: String(product._id),
        name: variantData ? `${product.name} - ${variantData.name}` : product.name,
        imageUrl: product.imageUrl?.[0] || "",
        price,
        quantity: Math.max(1, Number(quantity || 1)),
        sku: variantData?.sku || product.sku || null,
        variantId: variantId || null,
      });
    }

    // ===== Step 7: Price calculation =====
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Promo validation isolated per user or guest
    const userIdForPromo = session?.user?.id ?? `guest_${phone || "unknown"}`;
    const { discountValue } = await validatePromo(promocode, subtotal, userIdForPromo);

    const taxableBase = Math.max(0, subtotal - discountValue);
    const shipping = taxableBase > 999 ? 0 : 49;
    const total = taxableBase + shipping - shipping;

    if (total <= 0) return res.status(400).json({ error: "Invalid total amount" });

    // ===== Step 8: Create Razorpay order =====
    const rpOrder = await razorpay.orders.create({
      amount: total * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session?.user?.id || "guest",
        promo: promocode || "",
      },
    });

    // ===== Step 9: Create guest user if needed =====
    let userIdToStore = session?.user?.id;
    if (isGuest && phone) {
      // console.log("cerating guest user");
      const existingUser = await User.findOne({ phone });
      if (!existingUser) {
        const newUser = await User.create({ phone, name: "Guest User" });
        userIdToStore = newUser._id;
      } else {
        userIdToStore = existingUser._id;
      }
    }

    // console.log(isGuest, phone);

    // ===== Step 10: Store order securely =====
    await Order.create({
      userId: userIdToStore,
      products,
      promoCode: promocode || null,
      amountBreakDown: { subtotal, discount: discountValue, shipping, total },
      amount: total,
      currency: "INR",
      address: deliveryAddress,
      razorpayOrderId: rpOrder.id,
      status: "pending",
      paymentStatus: "pending",
      orderHistory: [
        { status: "pending", note: "Order created via Razorpay", updatedBy: "system", date: new Date() },
      ],
    });

    // ===== Step 11: Respond to frontend =====
    return res.status(200).json({
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      message: "Razorpay order created successfully",
      isGuest,
    });
  } catch (error) {
    console.error("🔴 Razorpay Create Order Error:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
}
