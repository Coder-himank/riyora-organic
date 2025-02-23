import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import "@/styles/product-card.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link"

export const SkeletonCard = () => {
  return (
    <>
      <motion.div
        className="product-card skeleton-card"
        initial={{ opacity: 0, y: 20 }} // Animation when card appears
        animate={{ opacity: 1, y: 0 }}
        // whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="product-img skeleton-img"></div>

        <div className="product-info">
          <h3 className="skeleton-text-1"></h3>
          <p className="skeleton-text-2"></p>
          <div className="product-actions">

            <div
              className="product-btn btn-buy skeleton-btn"
            >
            </div>
            <div
              className="product-btn btn-buy skeleton-btn"
            >
            </div>
            <div
              className="product-btn btn-buy skeleton-btn"
            >
            </div>

          </div>
        </div>
      </motion.div></>
  )
}
const ProductCard = ({ product }) => {

  const router = useRouter()
  async function onAddToCart(productId, quantity) {
    if (!session?.user) {
      router.push({ pathname: `/authenticate`, query: { callback: `/cart`, productId } })
      return

    }

    try {
      const response = await fetch(`/api/cart?userId=${session.user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, productId, quantity })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, message: "Request failed" };
    }
  }
  async function onAddToWishlist(productId) {
    if (!session?.user?.id) {
      router.push({ pathname: `/authenticate`, query: { callback: `/wishlist`, productId } })
      return
    }
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, productId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, message: "Request failed" };
    }
  }

  const onBuy = (productId) => {
    router.push({ pathname: `/checkout`, query: { productId } })
  }
  const { t } = useTranslation("common");
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [productData, setProductData] = useState({ ...product })



  // incase product id is provided we will fetch data of product from database directly
  return (
    <Link href={`/products/${productData._id}`}>
      <motion.div
        className="product-card"
        initial={{ opacity: 0, y: 20 }} // Animation when card appears
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Lazy Loaded Image */}
        <Image
          // src={product.image}
          src={productData.imageUrl || "/products/hoodie.jpg"}
          alt={productData.name}
          width={300} // Set the desired width
          height={300} // Set the desired height
          layout="responsive"
          objectFit="cover"
          className="product-image"
        />

        <div className="product-info">
          <h3 className="product-name">{productData.name}</h3>
          <p className="product-price">${productData.price}</p>
          <div className="product-actions">

            <motion.button
              className="product-btn btn-buy"
              onClick={() => onBuy(productData._id)}
              whileTap={{ scale: 0.9 }}
            >
              {t("buy_now")}
            </motion.button>
            <motion.button
              className="product-btn btn-cart"
              onClick={() => onAddToCart(productData._id, 1)}
              whileTap={{ scale: 0.9 }}
            >
              {t("add_to_cart")}
            </motion.button>
            <motion.button
              className="product-btn btn-wishlist"
              onClick={() => onAddToWishlist(productData._id)}
              whileTap={{ scale: 0.9 }}
              aria-label="Add to Wishlist"
            >
              ♥
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
