import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { motion } from "framer-motion";
import "@/styles/wishlist.module.css";
import "@/styles/products.module.css";
import { useSession } from "next-auth/react";
import UnAuthorizedUser from "@/components/UnAuthorizedUser";

export default function Wishlist() {
  const { t } = useTranslation("common");
  const { data: session, status: sessionStatus } = useSession();
  const [wishProductData, setWishProductData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.id) {
      fetchWishlist();
    }
  }, [sessionStatus]);

  const fetchWishlistData = async (wishlistItems) => {
    if (!wishlistItems.length) {
      setWishProductData([]);
      setIsLoading(false);
      return;
    }

    try {
      const productIds = wishlistItems.map(item => item.productId);
      const { data: products } = await axios.get(`/api/products?ids=${productIds.join(",")}`);
      setWishProductData(products);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishProductData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/api/wishlist", {
        params: { userId: session.user.id },
      });
      fetchWishlistData(data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishProductData([]);
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete("/api/wishlist", { data: { userId: session.user.id, productId } });
      setWishProductData((prev) => prev.filter((item) => item._id !== productId));
      showNotification(t("removed_from_wishlist"));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showNotification(t("unable_to_remove"));
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (sessionStatus === "loading") {
    return (
      <>
        <div className="wishlist-container">

          <div className="navHolder"></div>
          <p>Loading...</p>;
        </div>
      </>
    )
  }

  if (sessionStatus !== "authenticated") {
    return (
      <>
        <div className="wishlist-container">

          <div className="navHolder"></div>
          <UnAuthorizedUser />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="navHolder"></div>
      <div className="wishlist-container">
        <h1 className="wishlist-head">{t("wishlist")}</h1>

        {notification && <div className="notification">{notification}</div>}

        {isLoading ? (
          <WishlistSkeleton />
        ) : wishProductData.length === 0 ? (
          <EmptyWishlist t={t} />
        ) : (
          wishProductData.map((item) => (
            <div key={item._id} className="wishlist-item">
              <Link href={`/products/${item._id}`}>
                <motion.img
                  src={item.image || "/products/placeholder.jpg"}
                  alt={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <div className="wishlist-item-details">
                <Link href={`/products/${item._id}`}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {(item.features || []).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </Link>
              </div>
              <button className="remove-btn" onClick={() => removeFromWishlist(item._id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const WishlistSkeleton = () => (
  <>
    <div className="navHolder"></div>
    <div className="wishlist-container">
      <h1 className="wishlist-head">Loading Wishlist...</h1>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="wishlist-item loading">
          <div className="skeleton-img"></div>
          <div className="wishlist-item-details">
            <div className="skeleton-text"></div>
            <div className="skeleton-text small"></div>
            <div className="skeleton-list">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="skeleton-list-item"></div>
              ))}
            </div>
          </div>
          <button className="skeleton-btn"></button>
        </div>
      ))}
    </div>
  </>
);

const EmptyWishlist = ({ t }) => (
  <div className="empty-wishlist">
    <p>{t("wishlist_empty")}</p>
    <Link href="/products">
      <button className="shop-now">{t("shop_now")}</button>
    </Link>
  </div>
);

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
