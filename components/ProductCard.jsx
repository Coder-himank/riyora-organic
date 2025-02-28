import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import styles from "@/styles/product-card.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { onBuy, onAddToCart, onAddToWishlist } from "@/components/ProductAction";

export const SkeletonCard = () => {
  return (
    <motion.div
      className={`${styles.product_card} ${styles.skeleton_card}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${styles.product_image} ${styles.skeleton_image}`}></div>
      <div className={styles.product_info}>
        <h3 className={styles.skeleton_text_1}></h3>
        <p className={styles.skeleton_text_2}></p>
        <div className={styles.product_actions}>
          <div className={`${styles.product_btn} ${styles.skeleton_btn}`}></div>
          <div className={`${styles.product_btn} ${styles.skeleton_btn}`}></div>
          <div className={`${styles.product_btn} ${styles.skeleton_btn}`}></div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCard = ({ product }) => {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const [productData, setProductData] = useState({ ...product });

  return (
    <motion.div
      className={styles.product_card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${productData._id}`}>
        <Image
          src={productData.imageUrl || "/products/hoodie.jpg"}
          alt={productData.name}
          width={300}
          height={300}
          layout="responsive"
          objectFit="cover"
          className={styles.product_image}
        />
      </Link>

      <div className={styles.product_info}>
        <Link href={`/products/${productData._id}`}>
          <h3 className={styles.product_name}>{productData.name}</h3>
          <p className={styles.product_price}>${productData.price}</p>
        </Link>

        <div className={styles.product_actions}>
          <motion.button
            className={`${styles.product_btn} ${styles.btn_buy}`}
            onClick={() => onBuy(router, productData._id, session)}
            whileTap={{ scale: 0.9 }}
          >
            {t("product.buy_now")}
          </motion.button>
          <motion.button
            className={`${styles.product_btn} ${styles.btn_cart}`}
            onClick={() => onAddToCart(router, productData._id, session)}
            whileTap={{ scale: 0.9 }}
          >
            {t("product.add_to_cart")}
          </motion.button>
          <motion.button
            className={`${styles.product_btn} ${styles.btn_wishlist}`}
            onClick={() => onAddToWishlist(router, productData._id, session)}
            whileTap={{ scale: 0.9 }}
            aria-label="Add to Wishlist"
          >
            ♥
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
