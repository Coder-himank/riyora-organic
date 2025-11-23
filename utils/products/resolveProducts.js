// utils/order/resolveProducts.js
import Product from "@/server/models/Product";

export async function resolveProducts(sanitizedProducts) {
  const items = [];

  for (const { productId, variantId, quantity } of sanitizedProducts) {
    const product = await Product.findOne({
      _id: productId,
      deleted: { $ne: true },
      isVisible: { $ne: false },
    }).lean();

    if (!product) throw new Error(`Invalid product: ${productId}`);

    let variant = null;
    if (variantId && String(variantId) !== String(productId)) {
      variant = product.variants?.find((v) => String(v._id) === String(variantId));
      if (!variant) throw new Error(`Invalid variant for product ${productId}`);
    }

    const safeQty = Math.max(1, Number(quantity || 1));
    const price = variant ? variant.price : product.price;
    const mrp = variant ? variant.mrp || product.mrp : product.mrp;
    const name = variant ? `${product.name} - ${variant.name}` : product.name;

    items.push({
      productId,
      variantId: variant ? variant._id : null,
      name,
      imageUrl: product.imageUrl?.[0] || "",
      price,
      mrp,
      quantity: safeQty,
      sku: variant?.sku || product.sku || null,
    });
  }

  // totals
  const totals = items.reduce(
    (acc, item) => {
      acc.totalPrice += item.price * item.quantity;
      acc.totalMrp += item.mrp * item.quantity;
      acc.beforeTaxAmount += (item.price / 1.18) * item.quantity; // 18% GST
      return acc;
    },
    { totalPrice: 0, totalMrp: 0, beforeTaxAmount: 0 }
  );

  return { items, totals };
}
