// components/ProductCard.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/ProductCard.module.css"; // optional: create/adjust

export default function ProductCard({ product }) {
  // fallback: if product.variants is empty, treat base as single variant
  const variants = product.variants && product.variants.length ? product.variants : [{
    _id: "base",
    name: "Default",
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
    imageUrl: product.imageUrl || [],
    quantity: product.quantity
  }];

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = variants[selectedVariantIdx];

  useEffect(() => {
    // ensure quantity is within stock bounds
    if ((selectedVariant?.stock || 0) === 0) {
      setQuantity(0);
    } else if (quantity === 0) {
      setQuantity(1);
    } else if (quantity > (selectedVariant?.stock || 9999)) {
      setQuantity(selectedVariant?.stock || 9999);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantIdx]);

  const addToCart = () => {
    if ((selectedVariant.stock || 0) < quantity) {
      alert("Not enough stock for selected variant");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart_v1") || "[]");
    const variantId = selectedVariant._id || "base";

    const existingIdx = cart.findIndex(c => c.productId === product._id && c.variantId === variantId);
    if (existingIdx > -1) {
      cart[existingIdx].quantity += quantity;
      cart[existingIdx].price = selectedVariant.price; // update snapshot price
    } else {
      cart.push({
        productId: product._id,
        variantId,
        variantName: selectedVariant.name || "Default",
        productName: product.name,
        price: selectedVariant.price,
        mrp: selectedVariant.mrp || product.mrp,
        imageUrl: (selectedVariant.imageUrl && selectedVariant.imageUrl[0]) || product.imageUrl?.[0] || "",
        quantity,
      });
    }
    localStorage.setItem("cart_v1", JSON.stringify(cart));
    // nice UX - you can replace with toast
    alert("Added to cart");
  };

  return (
    <div className={styles.card || "productCard"}>
      <Link href={`/products/${product.slug}`}>
        <a className={styles.link}>
          <img src={selectedVariant.imageUrl?.[0] || product.imageUrl?.[0] || "/images/placeholder.png"} alt={product.name} className={styles.image} />
          <h3 className={styles.title}>{product.name}</h3>
        </a>
      </Link>

      <div className={styles.variantRow}>
        <label>Variant</label>
        <select value={selectedVariantIdx} onChange={(e) => setSelectedVariantIdx(Number(e.target.value))}>
          {variants.map((v, idx) => (
            <option key={v._id || idx} value={idx}>
              {v.name || `Option ${idx + 1}`} {v.quantity ? `- ${v.quantity}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.priceRow}>
        <div>
          <span className={styles.price}>₹{selectedVariant.price}</span>
          {selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price && (
            <span className={styles.mrp}>₹{selectedVariant.mrp}</span>
          )}
        </div>

        <div className={styles.cta}>
          <input
            type="number"
            min={1}
            max={selectedVariant.stock || 9999}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className={styles.qty}
          />
          <button onClick={addToCart} disabled={(selectedVariant.stock || 0) <= 0} className={styles.addBtn}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
