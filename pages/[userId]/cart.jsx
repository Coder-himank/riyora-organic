import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import styles from "@/styles/cart.module.css";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const SkeletonCart = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <div key={index} className={styles.cart_item}>
        <div className={styles.skeleton_image}></div>
        <div className={styles.cart_item_details}>
          <div className={styles.skeleton_text}></div>
          <div className={styles.skeleton_text_small}></div>
          <span className={styles.quantity_controls}>
            <span className={styles.skeleton_btn}></span>
            <span className={styles.skeleton_qty}></span>
            <span className={styles.skeleton_btn}></span>
          </span>
        </div>
        <span className={styles.remove_btn}></span>
      </div>
    ))}
  </>
);

export default function Cart() {
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;

  const { data: cartItems, error, mutate, isValidating } = useSWR(
    userId ? `/api/secure/cart?userId=${userId}` : null,
    fetcher
  );

  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setCart([]);
      return;
    }

    const fetchCartData = async () => {
      try {
        const productIds = cartItems.map((item) => item.productId);
        const { data: products } = await axios.get(`/api/getProducts?ids=${productIds.join(",")}`);

        const mergedCart = cartItems.map((item) => ({
          ...item,
          ...products.find((p) => p._id === item.productId),
        }));

        setCart(mergedCart);
      } catch (error) {
        console.error("Error fetching Cart Data", error);
      }
    };

    fetchCartData();
  }, [cartItems]);

  useEffect(() => {
    setCartTotal(cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity_demanded, 0));
  }, [cart]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/secure/cart?userId=${userId}`, {
        data: { productId, userId },
      });
      mutate();
      showNotification("Item Removed From Cart Successfully");
    } catch (error) {
      console.error("Error Removing Item", error);
    }
  };
  const updateQuantityOptimistic = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity_demanded: quantity } : item
    );
    setCart(updatedCart);

    try {
      await axios.put(`/api/secure/cart`, { userId, productId, quantity });
      mutate();
      showNotification("Cart Updated Successfully");
    } catch (error) {
      console.error("Error Updating Cart", error);
    }
  };


  if (sessionStatus === "loading" || !cartItems) {
    return (
      <>
        <div className="navHolder"></div>
        <SkeletonCart />
      </>
    );
  }

  if (sessionStatus !== "authenticated") {
    return (
      <>
        <div className="navHolder"></div>
        <UnAuthorizedUser />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="navHolder"></div>
        <div className={styles.cart_loading}>
          <p>Error loading cart.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="navHolder"></div>
      {isValidating && <div className={styles.cart_updating}></div>}
      <div className={styles.cart_container}>
        <h1 className={styles.cart_head}>Your Cart</h1>

        {notification && <div className="notification">{notification}</div>}

        {cart.length === 0 ? (
          <div className={styles.empty_cart}>
            <p>Your cart is empty</p>
            <Link href="/products">
              <button className="shop-now">Shop Now</button>
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.productId} className={styles.cart_item}>
                <Link href={`/products/${item.productId}`}>
                  <motion.img
                    src={item.imageUrl || "/products/placeholder.jpg"}
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
                    <button
                      onClick={() =>
                        updateQuantityOptimistic(item.productId, item.quantity_demanded + 1)
                      }
                    >
                      +
                    </button>
                    <span className={styles.qty}>{item.quantity_demanded}</span>
                    <button
                      onClick={() =>
                        updateQuantityOptimistic(item.productId, item.quantity_demanded - 1)
                      }
                    >
                      -
                    </button>
                  </span>
                </div>
                <button
                  className={styles.remove_btn}
                  onClick={() => removeFromCart(item.productId)}
                >
                  x
                </button>
              </div>
            ))}

            <div className={styles.cart_billing}>
              <div className={styles.cart_total}>Total: ₹{cartTotal.toFixed(2)}</div>
              <Link href={`/${userId}/checkout`}>
                <button>Checkout</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
