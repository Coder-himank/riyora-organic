import styles from "@/styles/productPage.module.css";
import { onBuy } from "@/components/ProductAction";

export default function Actions({ handleAdd, product, qty, session, router, selectedVariant }) {
  return (
    <div className={styles.action_btn}>
      <button onClick={handleAdd}>Add To Cart</button>

      <button
        onClick={() => onBuy(router, product._id, qty, session, selectedVariant?._id)}
      >
        Buy Now
      </button>
    </div>
  );
}
