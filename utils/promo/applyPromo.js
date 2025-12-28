// utils/order/applyPromo.js
import { validatePromo } from "@/utils/promo/promo";

export async function applyPromo(promoCode, amount, session, phone, cartProductIds = []) {
  const userId = session?.user?.id || null;

  const { discountValue, error, message } = await validatePromo(
    promoCode,
    amount,
    userId,
    cartProductIds
  );


  return {discountValue, error, message};
}
