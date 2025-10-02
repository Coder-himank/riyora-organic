// pages/[userId]/orders/index.jsx
import styles from "@/styles/order-page.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export const Orders = () => {
  const { data: session } = useSession();
  const [ordersData, setOrdersData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    async function fetchOrdersData(userId = session?.user?.id) {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/secure/orders?userId=${userId}`);
        setOrdersData(response.data.orders);
      } catch (error) {
        setOrdersData([]);
        setError(error);
      }
    }
    fetchOrdersData(session?.user?.id);
  }, [session?.user, query.status]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const shouldDisplayOrder = (order) => {
    const statusQuery = query?.status;
    if (!statusQuery) return true;
    if (statusQuery === "all_orders") return true;
    if (statusQuery === "canceled" && order?.status === "cancelled")
      return true;
    return false;
  };

  if (error) {
    return <p>Error loading orders: {error.message}</p>;
  }

  const filteredOrders = ordersData?.filter(shouldDisplayOrder) || [];

  return (
    <div className={styles.orders_container}>
      <h1 className={styles.page_title}>My Orders</h1>

      <div className={styles.orders_list}>
        {ordersData === null ? (
          <SkeletonLoading />
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order._id}
              href={`/${session?.user?.id}/orders/${order._id}`}
              className={styles.order_card}
            >
              <div className={styles.order_header}>
                <span className={styles.order_id}>Order #{order._id}</span>
                <span className={styles.order_amount}>₹{order.amount}</span>
              </div>

              <div className={styles.products_section}>
                {order.products.map((product, index) => (
                  <div key={index} className={styles.product_item}>
                    <Image
                      src={product.imageUrl || "/images/placeholderProduct.png"}
                      width={80}
                      height={80}
                      alt={product.name || `Product ${index + 1}`}
                      className={styles.product_img}
                    />
                    <div className={styles.product_info}>
                      <span className={styles.product_name}>
                        {product.name || "Unnamed Product"}
                      </span>
                      <span>Qty: {product.quantity}</span>
                      <span>Price: ₹{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.order_details}>
                <span>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </span>
                <span>
                  <strong>Placed on:</strong> {formatDate(order.placedOn)}
                </span>
                <span>
                  <strong>Expected Delivery:</strong>{" "}
                  {formatDate(order.expectedDelivery)}
                </span>
                <span>
                  <strong>Order Status:</strong>{" "}
                  <span
                    className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}
                  >
                    {order.status}
                  </span>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const SkeletonLoading = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={styles.skeleton_order_card}>
          <div className={styles.skeleton_header}></div>
          <div className={styles.skeleton_products}></div>
          <div className={styles.skeleton_footer}></div>
        </div>
      ))}
    </>
  );
};

export default Orders;
