import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "@/styles/product-card.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { onAddToWishlist, onAddToCart } from "@/components/ProductAction";
import { FaArrowRight } from "react-icons/fa";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";

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

  const [isHovered, setIsHovered] = useState(false);
  const mouseHoverIn = () => {
    setIsHovered(true);

  }
  const mouseHoverOut = () => {

    setIsHovered(false);
  }

  const mouseClick = () => {
    if (isHovered) {
      router.push(`/products/${productData._id}`);
    }
    else if (!isHovered) {
      setIsHovered(true);
    }
    else {

      setIsHovered(!isHovered);
    }
  }

  // console.log("Product Data:", productData);


  return (

    <div className={styles.productCard} onMouseEnter={mouseHoverIn} onMouseLeave={mouseHoverOut} onClick={mouseClick}>
      <div className={styles.circle}></div>

      <Image src={productData.imageUrl[0]} alt={productData.name} width={300} height={300} className={styles.product_img} />



      <section className={styles.product_info}>

        {/* <Link href={`/products/${productData._id}`}> */}
        <section className={styles.hidden_details}>
          <section className={styles.top_detial_sec}>
            <section>
              <div className={styles.prices}>

                <span className={styles.old_price}>₹{productData.price}</span> |
                <span className={styles.new_price}>₹{productData.price}</span> |
                <span className={styles.discount}>{productData.discountPercentage}%</span>
              </div>
              <span className={styles.hidden_name}>{productData.name}</span>
              <div className={styles.hidden_rating}>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />

              </div>
            </section>
          </section>
          {/* <section className={styles.details_sec}>
            <div className={styles.category}>

              {productData.category.map((cat, index) => (
                <span key={index} className={styles.hidden_category}>{cat}</span>
              ))}
            </div>
          </section> */}
        </section>
        <section className={styles.details_sec}>
          <section className={styles.action_btn}>
            <button onClick={() => onAddToCart(router, productData._id, session)}><FaShoppingCart /></button>
          </section>
        </section>
      </section >
    </div >


  );
};

export default ProductCard;
