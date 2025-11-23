import Promocode from "@/server/models/Promocode";
import Order from "@/server/models/Order";

/**
 * VALIDATE PROMOCODE
 * Supports full Promocode schema:
 * - code, discount, active, validFrom, expiry
 * - usageLimit, timesUsed
 * - minimumOrderValue
 * - applicableProducts (products or variants)
 * - maxDiscount (optional)
 * - firstOrderOnly (optional)
 *
 * Returns:
 *  - discountValue: Number
 *  - promoDoc: Promocode document
 *  - error: string (if any)
 */
export async function validatePromo(code, subtotal, userId, cartProductIds = []) {
  if (!code) return { discountValue: 0, message : "No code" };

  const promo = await Promocode.findOne({ code: code.toUpperCase(), active: true });

  if (!promo) return { discountValue: 0, error: "Invalid promo code" };

  if(promo.onlyForSignedInUser) return {discountValue : 0, error: "SignIn Required"}


  const now = new Date();
  

  // 1. Validity period
  if (promo.validFrom && now < promo.validFrom)
    return { discountValue: 0, error: "Promo not started yet" };
  if (promo.expiry && now > promo.expiry)
    return { discountValue: 0, error: "Promo expired" };

  // 2. Minimum order value
  if (subtotal < (promo.minimumOrderValue || 0))
    return {
      discountValue: 0,
      error: `Minimum order value is ₹${promo.minimumOrderValue}`,
    };

  // 3. Applicable products check
  if (promo.applicableProducts?.length > 0) {
    const matches = cartProductIds.some((id) =>
      promo.applicableProducts.includes(String(id))
    );
    if (!matches)
      return { discountValue: 0, error: "Promo not applicable on selected products" };
  }

  // 4. Usage limit (global)
  if (promo.usageLimit > 0 && promo.timesUsed >= promo.usageLimit)
    return { discountValue: 0, error: "Promo usage limit reached" };

  // 5. First-order-only check

  if(userId){

    if (promo.firstOrderOnly) {
      const orders = await Order.find({ userId, paymentStatus: "completed" });
      if (orders.length > 0) return { discountValue: 0, error: "Promo valid for first order only" };
    }
    
    // 6. Check if user already used this promo (regardless of firstOrderOnly)
    const alreadyUsed = await Order.findOne({
      userId,
      promoCode: promo.code,
      paymentStatus: "completed",
    });
    if (alreadyUsed) return { discountValue: 0, error: "Promo already used by this user" };
  }

  // 7. Calculate discount
  let discountValue = Math.round((subtotal * promo.discount) / 100);

  // 8. Max discount cap
  if (promo.maxDiscount && promo.maxDiscount !== 0) discountValue =  Math.min(discountValue, promo.maxDiscount);

  // 9. Optional: Increment timesUsed
  if (promo.usageLimit > 0) {
    promo.timesUsed = (promo.timesUsed || 0) + 1;
    await promo.save();
  }

  return {
    discountValue,
    promoDoc: promo,
    message : promo.code + " Applied"
  };
}
