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
      console.log(err);
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
        <h1>Track Your Order</h1>

        {loading ? (
          <div className={styles.order_skeleton}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className={styles.order_item_skeleton}>
                <div className={styles.order_text_skeleton}></div>
              </div>
            ))}
          </div>
        ) : orderDetails.length === 0 ? (
          <p>No orders to track</p>
        ) : (
          orderDetails.map((order) => {
            const showOrder =
              order.status !== "delivered" ||
              (order.deliveredOn &&
                new Date(order.deliveredOn) >=
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

            return (
              showOrder && (
                <Link
                  key={order._id}
                  href={`/${userId}/orders/${order._id}`}
                  className={styles.order_link}
                >
                  <div className={styles.order_detail}>
                    <section className={styles.order_images}>
                      {order?.products?.map((product, idx) => (
                        <Image
                          key={idx}
                          src={product.imageUrl}
                          width={100}
                          height={100}
                          style={{ "--i": idx }}
                          alt={product.name || "Product Image"}
                        />
                      ))}
                    </section>
                    <section className={styles.details}>
                      <div className={styles.order_item}>
                        <strong>Order ID:</strong>{" "}
                        <span>{order.razorpayOrderId}</span>
                      </div>
                      <div className={styles.order_item}>
                        <strong>Placed on:</strong>{" "}
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.order_item}>
                        <strong>Expected delivery:</strong>{" "}
                        <span>
                          {new Date(
                            order.deliveredOn || order.estimatedDelivery
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.order_item}>
                        <strong>Payment status:</strong>{" "}
                        <span>{order.paymentStatus}</span>
                      </div>
                      <div className={styles.order_item}>
                        <strong>Order status:</strong>{" "}
                        <span>{order.status}</span>
                      </div>
                    </section>
                  </div>
                </Link>
              )
            );
          })
        )}
      </div>
    </>
  );
}
