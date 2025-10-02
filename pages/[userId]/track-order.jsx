import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/track-order.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function TrackOrder() {
  const router = useRouter();
  const { orderId, userId } = router.query;
  const { data: session } = useSession();

  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.isReady && session?.user?.id) {
      fetchOrderDetails(orderId, session.user.id);
    }
  }, [router.isReady, orderId, session?.user?.id]);

  const fetchOrderDetails = async (id, userId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/secure/orders?orderId=${id === "all" ? "all" : id}&userId=${userId}`
      );
      const orders = data.orders || (data.order ? [data.order] : []);
      setOrderDetails(orders);
    } catch (err) {
      setError("Error fetching order");
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className="navHolder"></div>
      <div className={styles.track_order_container}>
        <h1 className={styles.page_title}>Track Your Orders</h1>

        {loading ? (
          <div className={styles.skeleton_container}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.skeleton_card}></div>
            ))}
          </div>
        ) : orderDetails.length === 0 ? (
          <p>No active orders to track</p>
        ) : (
          orderDetails.map((order) => {
            const showOrder =
              order.status !== "delivered" ||
              (order.deliveredOn &&
                new Date(order.deliveredOn) >=
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

            if (!showOrder) return null;

            return (
              <Link
                key={order._id}
                href={`/${userId}/orders/${order._id}`}
                className={styles.order_card}
              >
                <div className={styles.order_header}>
                  <span className={styles.order_id}>
                    Order #{order.razorpayOrderId}
                  </span>
                  <span
                    className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className={styles.order_content}>
                  <div className={styles.order_images}>
                    {order?.products?.slice(0, 3).map((product, idx) => (
                      <Image
                        key={idx}
                        src={product.imageUrl || "/images/placeholderProduct.png"}
                        width={80}
                        height={80}
                        alt={product.name || "Product Image"}
                        className={styles.product_img}
                      />
                    ))}
                    {order.products.length > 3 && (
                      <span className={styles.more_products}>
                        +{order.products.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className={styles.details}>
                    <div className={styles.detail_item}>
                      <strong>Placed on:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className={styles.detail_item}>
                      <strong>Expected delivery:</strong>{" "}
                      {new Date(
                        order.deliveredOn || order.estimatedDelivery
                      ).toLocaleDateString()}
                    </div>
                    <div className={styles.detail_item}>
                      <strong>Payment:</strong> {order.paymentStatus}
                    </div>
                    <div className={styles.detail_item}>
                      <strong>Amount:</strong> ₹{order.amount}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
