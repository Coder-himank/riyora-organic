import styles from "@/styles/productPage.module.css";

export default function PriceBlock({ product, qty, increaseQty, decreaseQty }) {
  return (
    <div className={styles.price_quantity}>
      <div className={styles.price}>
        {product.discountPercentage > 0 && (
          <>
            <span className={styles.discount_perc}>{product.discountPercentage}% OFF</span>
            <span className={styles.originalPrice}>MRP : ₹{product.mrp}</span>
          </>
        )}
        <span className={styles.salePrice}> ₹{product.price}</span>
        <p className={styles.price_text}>{product.quantity} | GST included</p>
      </div>

      <div className={styles.quantity}>
        <button onClick={decreaseQty}>-</button>
        <span>{qty}</span>
        <button onClick={increaseQty}>+</button>
      </div>
    </div>
  );
}
