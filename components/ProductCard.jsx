// components/ProductCard.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/ProductCard.module.css"; // optional: create/adjust
import { onAddToCart } from "@/components/ProductAction";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
export default function ProductCard({ product }) {
  // fallback: if product.variants is empty, treat base as single variant
  const variants = [{
    _id: product._id,
    name: "Default",
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
    imageUrl: product.imageUrl || [],
    quantity: product.quantity
  },
  ...((product.variants && product.variants.length > 0) ? product.variants : [])
  ];

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = variants[selectedVariantIdx];

  const { router } = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    // ensure quantity is within stock bounds
    if ((selectedVariant?.stock || 0) === 0) {
      setQuantity(0);
    } else if (quantity === 0) {
      setQuantity(1);
    } else if (quantity > 5) {
      setQuantity(5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantIdx]);

  const handleAddToCart = () => {
    if ((selectedVariant.stock || 0) < quantity) {
      alert("Not enough stock for selected variant");
      return;
    }

    const res = onAddToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      quantity_demanded: quantity,
      session, // to be handled in onAddToCart
      router  // to be handled in onAddToCart

    });

    if (res.success) {
      toast.success("Added to cart successfully");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className={styles.card || "productCard"}>
      <Link href={`/products/${product.slug}`}>
        {/* <a className={styles.link}> */}
        <img src={selectedVariant.imageUrl?.[0] || product.imageUrl?.[0] || "/images/placeholder.png"} alt={product.name} className={styles.image} />
        <h3 className={styles.title}>{product.name}</h3>
        {/* </a> */}
      </Link>

      <div className={styles.variantRow}>
        {/* <label>Variant</label> */}
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
            max={5}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className={styles.qty}
          />
          <button onClick={handleAddToCart} disabled={(selectedVariant.stock || 0) <= 0} className={styles.addBtn}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
