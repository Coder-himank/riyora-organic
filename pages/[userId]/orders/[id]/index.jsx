import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { Package, Truck, Home, CircleCheckBig } from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "@/styles/OrderDetail.module.css";

const steps = [
  { label: "Order Placed", icon: <Package /> },
  { label: "Packed", icon: <Package /> },
  { label: "Shipped", icon: <Truck /> },
  { label: "Out for Delivery", icon: <Truck /> },
  { label: "Delivered", icon: <Home /> },
];

const statusMap = {
  placed: 0,
  packed: 1,
  shipped: 2,
  "out for delivery": 3,
  delivered: 4,
};

export default function OrderDetails() {
  const router = useRouter();
  const { id: orderId } = router.query;
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !session?.user?.id) return;

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `/api/secure/orders?orderId=${orderId}&userId=${session.user.id}`
        );
        if (isMounted) setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, session]);

  if (status === "loading") {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
        <p>Checking session...</p>
      </div>
    );
  }

  if (!session) return <p className={styles.error}>Please log in to view your order.</p>;
  if (loading) return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
      <p>Loading order...</p>
    </div>
  );
  if (!order) return <p className={styles.error}>Order not found</p>;

  const statusIndex = statusMap[order.status.toLowerCase()] ?? 0;
  const clampedIndex = Math.min(statusIndex, steps.length - 1);
  const isDelivered = clampedIndex === steps.length - 1;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Summary</h1>

      {/* === Delivery Success Section === */}
      {isDelivered && (
        <motion.div
          className={styles.successBox}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <CircleCheckBig size={80} className={styles.successIcon} />
          <h2>Delivered Successfully 🎉</h2>
          <p>Thank you for shopping with us! Enjoy your order.</p>
        </motion.div>
      )}

      {/* === Order Progress Tracker === */}
      {order.status !== "cancelled" && !isDelivered && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(clampedIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className={styles.truck}
              animate={{ left: `${(clampedIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, type: "spring" }}
            >
              <Truck size={30} />
            </motion.div>
          </div>
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={i} className={`${styles.step} ${i <= clampedIndex ? styles.active : ""}`}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Order Information Section === */}
      <div className={`${styles.orderCard} ${isDelivered ? styles.successColor : order.status === "cancelled" ? styles.danger : styles.progressColor}`}>
        <h3>Order #{order.razorpayOrderId}</h3>
        <div className={styles.orderInfoRow}>
          <div>
            <strong>Placed on:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Expected Delivery:</strong>{" "}
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </div>
        </div>
        <div className={styles.orderInfoRow}>
          <div><strong>Payment:</strong> {order.paymentStatus}</div>
          <div><strong>Status:</strong> {order.status}</div>
        </div>
        <div className={styles.orderTotal}>
          <strong>Total:</strong> ₹ {order.amount}
        </div>
      </div>

      {/* === Products Section === */}
      <div className={styles.products}>
        <h2>Items in this Order</h2>
        <div className={styles.productGrid}>
          {order.products?.length ? (
            order.products.map((p, idx) => (
              <motion.div key={idx} className={styles.productCard} whileHover={{ scale: 1.05 }}>
                <Image src={p.imageUrl || "/placeholder.png"} width={90} height={90} alt={p.name} className={styles.productImg} />
                <div>
                  <h3>{p.name}</h3>
                  <p>₹ {p.price} x {p.quantity}</p>
                </div>
              </motion.div>
            ))
          ) : <p>No items found in this order.</p>}
        </div>
      </div>

      {/* === Actions Section === */}
      <div className={styles.actionBtns}>
        <button className={styles.backButton} onClick={() => router.back()}>
          &larr; Back to Orders
        </button>
        {/* Uncomment when cancel functionality is enabled */}
        {/* {["pending","confirmed","ready_to_ship"].includes(order.status.toLowerCase()) && (
          <button className={styles.cancelBtn} onClick={handleOrderCancel}>Cancel</button>
        )} */}
      </div>
    </div>
  );
}
