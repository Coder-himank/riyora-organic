import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  CircleCheckBig,
} from "lucide-react";
import styles from "@/styles/OrderDetail.module.css";

const steps = [
  { label: "Order Placed", icon: <Package /> },
  { label: "Packed", icon: <Package /> },
  { label: "Shipped", icon: <Truck /> },
  { label: "Out for Delivery", icon: <Truck /> },
  { label: "Delivered", icon: <Home /> },
];

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/secure/order/${orderId}`);
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading order...</p>;
  if (!order) return <p className={styles.error}>Order not found</p>;

  const statusIndex = steps.findIndex((s) =>
    s.label.toLowerCase().includes(order.status.toLowerCase())
  );

  const isDelivered = order.status.toLowerCase() === "delivered";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Details</h1>

      {/* ✅ Delivery Success State */}
      {isDelivered && (
        <motion.div
          className={styles.successBox}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <CircleCheckBig size={80} className={styles.successIcon} />
          <h2>Delivered Successfully 🎉</h2>
          <p>Thank you for shopping with us! We hope you enjoy your order.</p>
        </motion.div>
      )}

      {/* Progress Tracker */}
      {!isDelivered && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className={styles.truck}
              animate={{ left: `${(statusIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, type: "spring" }}
            >
              <Truck size={30} />
            </motion.div>
          </div>
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${styles.step} ${i <= statusIndex ? styles.active : ""
                  }`}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Info */}
      <div className={styles.orderCard}>
        <h2>Order #{order.razorpayOrderId}</h2>
        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Expected Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
      </div>

      {/* Products */}
      <div className={styles.products}>
        <h2>Items in this Order</h2>
        <div className={styles.productGrid}>
          {order.products.map((p, idx) => (
            <motion.div
              key={idx}
              className={styles.productCard}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={p.imageUrl}
                width={90}
                height={90}
                alt={p.name}
                className={styles.productImg}
              />
              <div>
                <h3>{p.name}</h3>
                <p>Qty: {p.quantity}</p>
                <p>₹ {p.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
