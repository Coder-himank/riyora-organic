import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "@/styles/product-card.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { onAddToWishlist, onAddToCart } from "@/components/ProductAction";
import { FaArrowRight } from "react-icons/fa";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [productData, setProductData] = useState({ ...product });
  console.log(product);


  return (

    <div className={styles.productCard}>
      <Image src={productData.imageUrl} alt={productData.name} width={300} height={300} />
      <section className={styles.product_info}>

        <h3>{productData.name}</h3>
        {/* {t("home.read_more")} */}

        <Link href={`/products/${productData._id}`}><FaArrowRight /></Link>
      </section>

      <section className={styles.action_btn}>
        <button onClick={() => onAddToCart(router, productData._id, session)}><FaShoppingCart /></button>
        <button onClick={() => onAddToWishlist(router, productData._id, session)}><FaHeart /></button>
      </section>
    </div>


  );
};

export default ProductCard;
