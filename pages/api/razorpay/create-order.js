// pages/api/secure/razorpay/create-order.js
import Razorpay from "razorpay";
import dbConnect from "@/server/db";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";
import User from "@/server/models/User";
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    /** ✅ Step 1: Verify request origin (CSRF guard) */
    const origin = req.headers.origin || req.headers.referer || "";
    if (ALLOWED_ORIGIN) {
      const normalizedOrigin = origin.replace(/\/$/, "");
      const normalizedAllowed = ALLOWED_ORIGIN.replace(/\/$/, "");
      if (!normalizedOrigin.startsWith(normalizedAllowed)) {
        return res.status(403).json({ error: "Invalid request origin" });
      }
    }

    /** ✅ Step 2: Rate limit to prevent abuse */
    await rateLimit(req, res, { key: "createorder", points: 10, duration: 60 });

    /** ✅ Step 3: Authenticate user */
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /** ✅ Step 4: Connect DB */
    await dbConnect();
    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /** ✅ Step 5: Sanitize input */
    const { products: clientProducts, promocode: rawPromo, deliveryAddress } = req.body || {};
    const promocode = sanitizePromo(rawPromo);
    const productsInput = clientProducts
      ? sanitizeProducts(clientProducts)
      : sanitizeProducts(user.cartData || []);

    if (!deliveryAddress?.address || !deliveryAddress?.pincode) {
      return res.status(400).json({ error: "Invalid or missing delivery address" });
    }

    if (!productsInput.length) {
      return res.status(400).json({ error: "No products supplied" });
    }

    /** ✅ Step 6: Validate and sanitize products */
    const products = [];
    for (const { productId, quantity, variantId } of productsInput) {
      const product = await Product.findOne({
        _id: productId,
        deleted: { $ne: true },
        isVisible: { $ne: false },
      }).lean();

      if (!product) {
        return res.status(400).json({ error: `Invalid or hidden product (${productId})` });
      }

      let price = product.price;
      let variantData = null;

      if (variantId && product.variants?.length) {
        variantData = product.variants.find((v) => String(v._id) === String(variantId));
        if (!variantData) {
          return res.status(400).json({ error: `Invalid variant for product (${productId})` });
        }
        price = variantData.price || product.price;
      }

      products.push({
        productId: String(product._id),
        name: variantData ? `${product.name} - ${variantData.name}` : product.name,
        imageUrl: product.imageUrl?.[0] || "",
        price,
        quantity: Math.max(1, Number(quantity || 1)),
        sku: variantData?.sku || product.sku || null,
        variantId: variantId || null,
        variant: variantData || null,
      });
    }

    /** ✅ Step 7: Price calculation */
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { discountValue } = await validatePromo(promocode, subtotal, session.user.id);

    const taxableBase = Math.max(0, subtotal - discountValue);
    const tax = 0; // Modify if tax calculation needed
    const shipping = taxableBase > 999 ? 0 : 49;
    const total = taxableBase + shipping - shipping ;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    /** ✅ Step 8: Create Razorpay order securely */
    const rpOrder = await razorpay.orders.create({
      amount: total * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        promo: promocode || "",
      },
    });

    /** ✅ Step 9: Store order securely in DB */
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
      address: {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        email: deliveryAddress.email,
        label: deliveryAddress.label,
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state || "",
        country: deliveryAddress.country,
        pincode: deliveryAddress.pincode,
      },
      razorpayOrderId: rpOrder.id,
      status: "pending",
      paymentStatus: "pending",
      orderHistory: [
        {
          status: "pending",
          note: "Order created via Razorpay",
          updatedBy: "system",
          date: new Date(),
        },
      ],
    });

    /** ✅ Step 10: Respond securely */
    return res.status(200).json({
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      message: "Razorpay order created successfully",
    });
  } catch (error) {
    console.error("🔴 Razorpay Order Error:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
}
