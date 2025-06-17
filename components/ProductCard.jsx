import React, { useState } from "react";
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
  console.log(product);
  console.log(product);


  return (

    <div className={styles.productCard}>
      <div className={styles.circle}></div>

      <Image src={productData.imageUrl} alt={productData.name} width={300} height={300} className={styles.product_img} />
      <section className={styles.product_name}>

        <h3>{productData.name}</h3>

        <Link href={`/products/${productData._id}`} className={styles.link_btn}><FaArrowRight /></Link>
      </section>


      <section className={styles.product_info}>

        {/* <Link href={`/products/${productData._id}`}> */}
        <section className={styles.hidden_details}>
          <section className={styles.top_detial_sec}>
            <Image src={productData.imageUrl} alt={productData.name} width={100} height={100} />
            <section>
              <span className={styles.hidden_price}>{productData.price}</span>
              <span className={styles.hidden_name}>{productData.name}</span>
              <div className={styles.hidden_rating}>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />

              </div>
            </section>
          </section>
          <section className={styles.details_sec}>
            <div className={styles.category}>

              {productData.category.map((cat, index) => (
                <span key={index} className={styles.hidden_category}>{cat}</span>
              ))}
            </div>
          </section>
          <section className={styles.details_sec}>
            <section className={styles.benefit_image}>

              <Image src={"/images/nutrition.png"} width={30} height={30} />
              <Image src={"/images/muscle.png"} width={30} height={30} />
              <Image src={"/images/plant.png"} width={30} height={30} />
              <Image src={"/images/enviornment.png"} width={30} height={30} />
            </section>
          </section>
        </section>
        <section className={styles.details_sec}>
          <section className={styles.action_btn}>
            <button onClick={() => onAddToCart(router, productData._id, session)}><FaShoppingCart /></button>
            <button onClick={() => onAddToWishlist(router, productData._id, session)}><FaHeart /></button>
          </section>
        </section>
        <section className={styles.details_sec}>
          <Link href={`/products/${productData._id}`} className={styles.link_btn_full}>View Product<FaArrowRight /></Link>
        </section>
        {/* </Link> */}
      </section >
    </div >


  );
};

export default ProductCard;
