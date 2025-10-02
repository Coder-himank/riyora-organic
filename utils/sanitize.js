export function sanitizePromo(code) {
    if (!code || typeof code !== "string") return "";
    return code.trim().slice(0, 32).toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

export function sanitizeProducts(arr) {
    if (!Array.isArray(arr)) return null;
    // console.log(arr)
    return arr
        .map((x) => ({
            productId: String(x?.productId || "").trim(),
            variantId: String(x?.variantId || "").trim(),
            quantity: Number(x?.quantity || x?.quantity_demanded || 1),
        }))
        .filter((x) => x.productId && x.quantity > 0 && x.quantity <= 5); // set the maximum number of products a perosn can porder at a time
}
