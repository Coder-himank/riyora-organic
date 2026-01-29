// pages/cart.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import styles from "@/styles/cart.module.css";
import getProductUrl from "@/utils/products/productsUtils";

// 🛒 Guest cart utils (unchanged)
const getGuestCart = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("guest_cart")) || [];
  } catch {
    return [];
  }
};
const saveGuestCart = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};
const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("guest_cart");
};

const fetcher = (url) => axios.get(url).then((res) => res.data);

// Skeleton loader (unchanged)
const SkeletonCart = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <div className={styles.cart_container}>

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
      </div>
    ))}
  </>
);

export default function Cart() {
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;
  const isLoggedIn = Boolean(userId);

  const { data: dbCartItems, mutate, isValidating } = useSWR(
    isLoggedIn ? `/api/secure/cart?userId=${userId}` : null,
    fetcher
  );

  // rawGuestCart is only simple storage items: { productId, variantId?, quantity_demanded }
  // cart is "enriched" with product details: name, price, imageUrl, description
  const [rawGuestCart, setRawGuestCart] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [notification, setNotification] = useState(null);
  const [shopNowLink, setShopNowLink] = useState(null);

  // ref to ignore stale fetch responses
  const fetchCounterRef = useRef(0);

  // Load guest raw cart once (only when not logged in)
  useEffect(() => {
    if (!isLoggedIn) {
      const localCart = getGuestCart();
      setRawGuestCart(localCart);
    } else {
      // When user logs in, clear raw guest state (we rely on DB cart)
      setRawGuestCart([]);
    }
  }, [isLoggedIn]);

  // Enrich guest cart (only when rawGuestCart changes and user is not logged in)
  useEffect(() => {
    if (isLoggedIn) return; // don't run for logged in users
    if (!rawGuestCart || rawGuestCart.length === 0) {
      setCart([]); // nothing to display
      return;
    }

    // Build deduped product ids
    const productIds = Array.from(new Set(rawGuestCart.map((i) => i.productId).filter(Boolean)));
    if (productIds.length === 0) {
      setCart([]);
      return;
    }

    const localFetchId = ++fetchCounterRef.current;

    const fetchGuestProducts = async () => {
      try {
        const { data: products } = await axios.get(`/api/getProducts?ids=${productIds.join(",")}`);
        // If a newer fetch started, ignore this response
        if (localFetchId !== fetchCounterRef.current) return;

        // Map rawGuestCart onto product info (preserves order)
        const merged = rawGuestCart.map((item) => {
          const product = products.find((p) => p._id === item.productId);
          const variant =
            item.variantId && product?.variants?.length
              ? product.variants.find((v) => v._id.toString() === item.variantId?.toString())
              : null;

          const name = product ? (variant ? `${product.name} - ${variant.name}` : product.name) : "Product unavailable";
          const price = product ? (variant ? variant.price : product.price) : 0;
          const imageUrl = product
            ? variant?.imageUrl?.length
              ? variant.imageUrl
              : product.imageUrl
            : null;
          const description = product ? product.description : "";
          const slug = product ? product.slug : "";

          return {
            ...item,
            name,
            price,
            imageUrl,
            description,
            slug
          };
        });

        setCart(merged);
      } catch (err) {
        console.error("fetchGuestProducts error:", err);
      }
    };

    fetchGuestProducts();
  }, [rawGuestCart, isLoggedIn]);

  // Enrich logged-in DB cart (only when dbCartItems changes)
  useEffect(() => {
    if (!isLoggedIn) return;
    if (!dbCartItems || dbCartItems.length === 0) {
      setCart([]);
      return;
    }

    const productIds = Array.from(new Set(dbCartItems.map((i) => i.productId).filter(Boolean)));
    if (productIds.length === 0) {
      setCart([]);
      return;
    }

    const localFetchId = ++fetchCounterRef.current;

    const fetchProducts = async () => {
      try {
        const { data: products } = await axios.get(`/api/getProducts?ids=${productIds.join(",")}`);
        if (localFetchId !== fetchCounterRef.current) return;

        const merged = dbCartItems.map((item) => {
          const product = products.find((p) => p._id === item.productId);
          const variant =
            item.variantId && product?.variants?.length
              ? product.variants.find((v) => v._id.toString() === item.variantId?.toString())
              : null;

          const name = product ? (variant ? `${product.name} - ${variant.name}` : product.name) : "Product unavailable";
          const price = product ? (variant ? variant.price : product.price) : 0;
          const imageUrl = product
            ? variant?.imageUrl?.length
              ? variant.imageUrl
              : product.imageUrl
            : null;
          const description = product ? product.description : "";
          const slug = product ? product.slug : "";

          return {
            ...item,
            name,
            price,
            imageUrl,
            description,
            slug
          };
        });

        setCart(merged);
      } catch (err) {
        console.error("fetchProducts error:", err);
      }
    };

    fetchProducts();
  }, [dbCartItems, isLoggedIn]);

  // Total price calculation
  useEffect(() => {
    setCartTotal(
      cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity_demanded) || 1), 0)
    );
  }, [cart]);

  // Shop now link loader
  useEffect(() => {
    (async () => {
      try {
        const url = await getProductUrl();
        setShopNowLink(url);
      } catch (err) {
        // ignore - keep link null
      }
    })();
  }, []);

  // Small notification helper
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  // Utility: safe image picker (handles arrays / single string / null)
  const getPrimaryImage = (imageUrl) => {
    if (!imageUrl) return "/placeholder.png";
    if (Array.isArray(imageUrl)) return imageUrl[0] || "/placeholder.png";
    return String(imageUrl);
  };

  // Update quantity (optimistic)
  const updateQuantityOptimistic = async (productId, variantId, qty) => {
    if (qty < 1) return removeFromCart(productId, variantId);
    if (qty > 5) {
      showNotification("Max 5 units allowed");
      return;
    }

    // Guest update -> update rawGuestCart + UI cart
    if (!isLoggedIn) {
      // Update raw
      const updatedRaw = rawGuestCart.map((it) =>
        it.productId === productId && (it.variantId || null) === (variantId || null)
          ? { ...it, quantity_demanded: qty }
          : it
      );
      setRawGuestCart(updatedRaw);
      saveGuestCart(updatedRaw);

      // Update enriched UI (if already enriched)
      setCart((prev) =>
        prev.map((it) =>
          it.productId === productId && (it.variantId || null) === (variantId || null)
            ? { ...it, quantity_demanded: qty }
            : it
        )
      );

      return;
    }

    // Logged-in update -> optimistic UI + server
    setCart((prev) =>
      prev.map((it) =>
        it.productId === productId && (it.variantId || null) === (variantId || null)
          ? { ...it, quantity_demanded: qty }
          : it
      )
    );

    try {
      await axios.put(`/api/secure/cart`, {
        userId,
        productId,
        variantId,
        quantity: qty,
      });
      // revalidate db cart
      mutate();
    } catch (err) {
      console.error("updateQuantityOptimistic error:", err);
      // could re-fetch/rollback here if desired
    }
  };

  // Remove item
  const removeFromCart = async (productId, variantId) => {
    // Guest remove
    if (!isLoggedIn) {
      const updatedRaw = rawGuestCart.filter(
        (i) => !(i.productId === productId && (i.variantId || null) === (variantId || null))
      );
      setRawGuestCart(updatedRaw);
      saveGuestCart(updatedRaw);

      setCart((prev) => prev.filter((i) => !(i.productId === productId && (i.variantId || null) === (variantId || null))));
      return;
    }

    // Logged in remove
    try {
      await axios.delete(`/api/secure/cart?userId=${userId}`, {
        data: { userId, productId, variantId },
      });
      mutate();
    } catch (err) {
      console.error("removeFromCart error:", err);
    }
  };

  // Loading skeleton
  if (sessionStatus === "loading")
    return (
      <>
        <div className="navHolder"></div>
        <SkeletonCart />
      </>
    );

  return (
    <>
      <div className="navHolder"></div>


      <div className={styles.cart_container}>
        <h1 className={styles.cart_head}>Your Cart</h1>

        {notification && <div className="notification">{notification}</div>}

        {cart.length === 0 ? (
          <div className={styles.empty_cart}>
            <p>Your cart is empty </p>
            {shopNowLink && (
              <Link href={shopNowLink} >
                <span className={styles.shopBtn}>Shop Now</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            {cart.map((item) => {
              const img = getPrimaryImage(item.imageUrl);
              const qty = Number(item.quantity_demanded) || 1;
              return (
                <div key={`${item.productId}-${item.variantId || ""}`} className={styles.cart_item}>
                  <Link href={`/products/${item.slug}`}>
                    <motion.img
                      src={img}
                      alt={item.name || "Product"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                  </Link>

                  <div className={styles.cart_item_details}>
                    <Link href={`/products/${item.slug}`}>
                      <h3>{item.name}</h3>
                      <p>
                        {item.description?.slice(0, 120)}
                        {item.description?.length > 120 && "..."}
                      </p>
                    </Link>

                    <span className={styles.quantity_controls}>
                      <button
                        onClick={() =>
                          updateQuantityOptimistic(item.productId, item.variantId, qty - 1)
                        }
                      >
                        -
                      </button>

                      <span className={styles.qty}>{qty}</span>

                      <button
                        onClick={() =>
                          updateQuantityOptimistic(item.productId, item.variantId, qty + 1)
                        }
                      >
                        +
                      </button>
                    </span>
                  </div>

                  <button
                    className={styles.remove_btn}
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                  >
                    x
                  </button>
                </div>
              );
            })}

            <div className={styles.cart_billing}>
              <div className={styles.cart_total}>Total: ₹{cartTotal.toFixed(2)}</div>
              <Link href="https://www.flipkart.com/riyora-organic-root-strength-hair-oil-ayurvedic-formula-growth-fall-control/p/itmd5b1b871c9faa">
                <button className={styles.checkoutbtn}>Checkout</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
