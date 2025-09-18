// lib/cart.js
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart_v1") || "[]");
  } catch (e) {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem("cart_v1", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart_v1");
}
