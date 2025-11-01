import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/OrderSuccess.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function OrderSuccess() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const { data: session } = useSession();
  const [userId, setUserId] = useState(null); // either session user or guest

  useEffect(() => {
    // 1️⃣ Determine the user ID: session or guest
    if (session?.user?.id) {
      setUserId(session.user.id);
    } else if (typeof window !== "undefined") {
      const storedGuest = localStorage.getItem("guest_user");
      if (storedGuest) {
        try {
          const guest = JSON.parse(storedGuest);
          setUserId(guest.id ?? guest._id);
        } catch (e) {
          console.error("Failed to parse guest user from localStorage", e);
        }
      }
    }
  }, [session]);

  useEffect(() => {
    const fetchOrderDetails = async (orderId, userId) => {
      if (!orderId || !userId) return;

      try {
        const res = await axios.get(
          `/api/secure/orders?orderId=${orderId}&userId=${userId}`
        );

        if (res.data.success) {
          setOrder(res.data.order); // ✅ Use 'order' from API
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (!router.isReady || !userId) return;

    fetchOrderDetails(router.query.orderId, userId);
  }, [router.isReady, router.query, userId]);

  if (!order) {
    return (
      <div className={styles.loadingWrapper}>
        <p>Fetching your order details...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.checkIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Payment Successful 🎉</h1>
        <p className={styles.subtitle}>
          Your order has been placed successfully.
        </p>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <p>
            <b>Order ID:</b> {order._id}
          </p>
          <p>
            <b>Amount Paid:</b> ₹{order.amount}
          </p>
          <p>
            <b>Payment ID:</b> {order.paymentId}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className={`${styles.badge} ${styles[order.paymentStatus]}`}>
              {order.paymentStatus}
            </span>
          </p>
        </div>

        <Link
          href={`/${userId}/orders/${order._id}`}
          className={styles.ctaButton}
        >
          View Order Details →
        </Link>
      </div>
    </div>
  );
}
