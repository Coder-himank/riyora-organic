import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import "@/styles/userProfile.module.css";
import axios from "axios";

export default function UserProfile() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const sectionsRef = useRef([]);

  // Fetch user profile
  useEffect(() => {
    if (!session?.user) return;

    const fetchUserProfile = async () => {
      console.log(session.user.id);

      try {
        const res = await axios.get(`/api/userProfile?userId=${session.user.id}`);
        if (res.status !== 200) {
          throw new Error("Failed to fetch user data", res.message);
        }
        const data = await res.data;
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [session]);



  if (error) return (
    <>
      <div className="navHolder"></div>
      <p className="error">{t("error_loading")}: {error}</p>
    </>)

  if (!user) return (
    <>
      <div className="navHolder"></div>
      <div className="loading-spinner"></div>; // Better UX for loading

    </>
  )

  return (
    <>
      <div className="navHolder"></div>
      <div className="profile-container">
        <h1>👤 {t("user_profile")}</h1>

        <div className="profile-card">
          <h2>{user?.name}</h2>
          <p>{t("email")}: {user?.email}</p>
          <p>{t("phone")}: {user?.phone}</p>
          <p>{t("role")}: {user?.role}</p>
          <p>{t("loyalty_points")}: {user?.loyaltyPoints}</p>
        </div>

        {/* Addresses Section */}
        <Section title="📍 " label="addresses" data={user?.addresses} ref={(el) => sectionsRef.current[0] = el} renderItem={(address) => (
          <div className="card">
            <h3>{address.label.toUpperCase()}</h3>
            <p>{address.address}</p>
            <p>{address.city}, {address.country} - {address.pincode}</p>
          </div>
        )} />

        {/* Cart Data */}
        <Section title="🛒 " label="cart_items" data={user?.cartData} ref={(el) => sectionsRef.current[1] = el} renderItem={(item) => (
          <div className="card">
            <p>{t("product")}: {item.productId}</p>
            <p>{t("quantity")}: {item.quantity_demanded}</p>
          </div>
        )} />

        {/* Wishlist */}
        <Section title="❤️ " label="wishlist" data={user?.wishlistData} ref={(el) => sectionsRef.current[2] = el} renderItem={(item) => (
          <div className="card">
            <p>{t("product")}: {item.productId}</p>
          </div>
        )} />

        {/* Order History */}
        <Section title="📦 " label="order_history" data={user?.orderHistory} ref={(el) => sectionsRef.current[3] = el} renderItem={(order) => (
          <div className="card">
            <p>{t("order_id")}: {order.orderId}</p>
            <p>{t("status")}: {order.status}</p>
            <p>{t("amount")}: ${order.totalAmount}</p>
            <p>{t("placed_on")}: {new Date(order.placedOn).toLocaleDateString()}</p>
          </div>
        )} />
      </div>
    </>
  );
}

// Reusable Section Component
const Section = ({ title, label, data, renderItem }, ref) => (
  <div ref={ref} className="section">
    <h2>{title} {useTranslation("common").t(label)}</h2>
    <div className="grid">
      {data?.length ? data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      )) : <p>{useTranslation("common").t(`no_${label}`)}</p>}
    </div>
  </div>
);

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
