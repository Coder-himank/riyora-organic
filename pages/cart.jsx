import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import styles from "@/styles/cart.module.css";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";
import Checkout from "./checkout";

const fetcher = (url) => axios.get(url).then((res) => res.data);


const SkeletonCart = () => {
  return (
    <>
      <div className={styles.cart_item}>
        <div className={styles.skeleton_image}></div>

        <div className={styles.cart_item_details}>
          <div className={styles.skeleton_text}></div>
          <div className={styles.skeleton_text_small}></div>

          <span className={styles.quantity_controls}>
            <span className={styles.skeleton_btn}></span>
            <span className={styles.skeleton_qty}></span>
            <span className={styles.skeleton_btn} ></span>
          </span>
        </div>
        <span className={styles.remove_btn} ></span>

      </div>
    </>
  )
}

export default function Cart() {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const userId = session?.user?.id;


  const { data: cartItems, error, mutate } = useSWR(
    userId ? `/api/cart?userId=${userId}` : null,
    fetcher
  );

  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart details
  useEffect(() => {
    if (!session?.user) {
      setLoading(false)
      return
    }
    if (!cartItems || !userId) {
      return
    };


    const fetchCartData = async () => {
      try {
        if (cartItems.length === 0) {
          setCart([]);
          return;
        }
        setLoading(true)

        const productIds = cartItems.map((item) => item.productId);
        const { data: products } = await axios.get(`/api/products?ids=${productIds.join(",")}`);

        const mergedCart = cartItems.map((item) => ({
          ...item,
          ...products.find((p) => p._id === item.productId),
        }));

        setCart(mergedCart);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
      setLoading(false)
    };

    fetchCartData();
  }, [cartItems, userId]);

  // Calculate cart total
  useEffect(() => {
    setCartTotal(cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity_demanded, 0));
  }, [cart]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart?userId=${userId}`, { data: { productId, userId } });
      mutate(); // Refresh SWR cache
      showNotification("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Update quantity (debounced)
  const debouncedUpdateQuantity = debounce(async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`/api/cart`, { userId, productId, quantity });
      mutate(); // Refresh cart data
      showNotification("Cart updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }, 500);

  if (!session && !session?.user) return (

    <UnAuthorizedUser />
  )

  if (loading) return (
    <>
      <div className="navHolder"></div>
      <SkeletonCart />
      <SkeletonCart />
      <SkeletonCart />
      <SkeletonCart />
      <SkeletonCart />
    </>
  )

  if (error) return (
    <>
      <div className="navHolder"></div>
      <div className={styles.cart_loading}><p>Error loading cart.</p></div>;
    </>
  )



  return (<>
    <div className="navHolder"></div>
    <div className={styles.cart_container}>
      <h1 className={styles.cart_head}>{t("cart")}</h1>

      {notification && <div className="notification">{notification}</div>}

      {cart.length === 0 ? (
        <div className={styles.empty_cart}>
          <p>Your cart is empty.</p>
          <Link href="/products">
            <button className="shop-now">{t("shop_now")}</button>
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.productId} className={styles.cart_item}>
              <Link href={`/products/${item.productId}`}>
                <motion.img
                  src={item.imageUrl || "/products/hoodie.jpg"}
                  alt={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <div className={styles.cart_item_details}>
                <Link href={`/products/${item.productId}`}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Link>

                <span className={styles.quantity_controls}>
                  <button onClick={() => debouncedUpdateQuantity(item.productId, item.quantity_demanded + 1)}>+</button>
                  <span className={styles.qty}>{item.quantity_demanded}</span>
                  <button onClick={() => debouncedUpdateQuantity(item.productId, item.quantity_demanded - 1)}>-</button>
                </span>
              </div>
              <button className={styles.remove_btn} onClick={() => removeFromCart(item.productId)}>🗑️</button>
            </div>
          ))}

          <div className={styles.cart_billing}>
            <div className={styles.cart_total}>
              Total: ${cartTotal.toFixed(2)}
            </div>
          <Link href={"/checkout"}>
            <button>

              Continue to check Out
            </button>
          </Link>
          </div>
        </>
      )}

    </div>
  </>
  );
}

// Debounce function
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// i18n translations
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
