import dbConnect from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { sanitizePromo, sanitizeProducts } from "@/utils/security/sanitize";

import { resolveProducts } from "@/utils/checkoutHelper/resolveProducts";
import { applyPromo } from "@/utils/checkoutHelper/applyPromo";
import { calcDelivery } from "@/utils/checkoutHelper/calcDelivery";
import { validateOrigin, setupBase } from "@/utils/security/secureApi";
const GST = 0.18;

export default async function handler(req, res) {
  validateOrigin(req, process.env.NEXT_PUBLIC_SITE_URL);
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await setupBase(req, res, "checkout", 30, 60);

    const session = await getServerSession(req, res, authOptions);
    const { products: clientProducts, promocode: rawPromo, addressId, phone } =
      req.body || {};

    const sanitizedProducts = sanitizeProducts(clientProducts);
    const promoCode = sanitizePromo(rawPromo);

    if (!sanitizedProducts.length)
      return res.status(400).json({ error: "Invalid products." });

    // Get validated products
    const { items, totals } = await resolveProducts(sanitizedProducts);

    const {discountValue:promoDiscount, error : promoError, message : promoMessage} = await applyPromo(
      promoCode,
      totals.totalPrice,
      session,
      phone,
      items.map((item) => item.productId)
    );

    console.log(totals);

    const productDiscount = totals.totalMrp - totals.totalPrice;

    const totalDiscount = productDiscount + promoDiscount;

    const taxedAmount = totals.totalPrice - totals.beforeTaxAmount;

    const deliveryCharges = calcDelivery(totals.totalPrice);

    const finalAmount = totals.totalPrice - promoDiscount;

    const totalAmount = totals.totalPrice + deliveryCharges;

    const response = {
      success: true,
      products: items,
      itemTotal: totals.totalPrice,
      beforeTaxAmount: totals.beforeTaxAmount,
      promoDiscount,
      discount: totalDiscount,
      taxedAmount,
      deliveryCharges,
      totalAmount,
      finalAmount,
      addressId: addressId || null,
      isGuest: !session?.user?.id,
      promoError : promoError,
      promoMessage,
    }

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Checkout API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
