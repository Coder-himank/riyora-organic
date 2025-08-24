import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/OrderDetail.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !session?.user?.id) return;

      try {
        const response = await axios.get(
          `/api/secure/orders?orderId=${id}&userId=${session.user.id}`
        );

        if (response.data.success) {
          setOrder(response.data.order); // ✅ single order from API
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    if (router.isReady) fetchOrder();
  }, [id, session?.user?.id, router.isReady]);

  if (!order) {
    return (
      <div className={styles.loadingWrapper}>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Order Details</h1>

      {/* Order Info */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Order Info</h2>
        <p>
          <b>Order ID:</b> {order._id}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span
            className={`${styles.badge} ${styles[order.status]} ${order.status === "ready to ship" ? styles.ready_to_ship : ""}`}
          >
            {order.status}
          </span>
        </p>
        <p>
          <b>Placed On:</b> {new Date(order.placedOn).toLocaleString()}
        </p>
      </section>

      {/* Products */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {order?.products?.map((p, idx) => (
          <div key={idx} className={styles.productItem}>
            <img
              src={p.imageUrl}
              alt={p.name}
              className={styles.productImage}
            />
            <div className={styles.productDetails}>
              <p className={styles.productName}>{p.name}</p>
              <p className={styles.productSku}>SKU: {p.sku}</p>
              <p className={styles.productPrice}>
                {p.quantity} x ₹{p.price}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Address */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>

        {order?.address && (
          <>
            <p>{order.address.name}</p>
            <p>
              {order.address.address}, {order.address.city},{" "}
              {order.address.state} - {order.address.pincode}
            </p>
            <p>{order.address.country}</p>
            <p>📞 {order.address.phone}</p>
          </>
        )}
      </section>

      {/* Payment */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Payment</h2>
        <p>
          <b>Payment ID:</b> {order.paymentId}
        </p>
        <p>
          <b>Method:</b> {order.paymentDetails?.method}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span className={`${styles.badge} ${styles[order.paymentStatus]}`}>
            {order.paymentStatus}
          </span>
        </p>
      </section>

      {/* Courier */}
      {order.courier?.courierId && (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Courier</h2>
          <p>
            <b>Courier:</b> {order.courier.courier_name}
          </p>
          <p>
            <b>Tracking ID:</b> {order.courier.courierId}
          </p>
          {order.courier.trackingUrl && (
            <a
              href={order.courier.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.trackLink}
            >
              Track Shipment →
            </a>
          )}
        </section>
      )}

      {/* Order History */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Order History</h2>
        {order.orderHistory.map((h, idx) => (
          <div key={idx} className={styles.historyItem}>
            <p>
              <b>{h.status}</b> — {new Date(h.date).toLocaleString()}
            </p>
            {h.note && <p className={styles.historyNote}>Note: {h.note}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}
