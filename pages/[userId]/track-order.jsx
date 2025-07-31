import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/track-order.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function TrackOrder() {
    const router = useRouter();
    const { orderId } = router.query;
    const { data: session } = useSession();
    const { userId } = router.query;

    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId && session?.user?.id) {
            fetchOrderDetails(orderId, session.user.id);
        }
    }, [orderId, session?.user?.id]);

    const fetchOrderDetails = async (id, userId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/secure/orders?orderId=${id === "all" ? "" : id}&userId=${userId}`);
            setOrderDetails(data.orderDetails);
        } catch (err) {
            setError(t("error_fetching_order"));
            setOrderDetails([]);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

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
                    orderDetails.map((order) => (
                        <>
                            {((order.status !== "delivered") || (order.status === "delivered" && new Date(order.deliveredOn) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))) && (
                                // render something here

                                <Link href={`/${userId}/orderDetail?orderId=${order._id}&userId=${session?.user?.id}`} key={order._id} className={styles.order_link}>
                                    <div className={styles.order_detail} key={order.orderId}>

                                        <section className={styles.order_images}>
                                            {/* Images */}

                                            {order?.products?.map((product, index) => <>
                                                <Image src={product.imageUrl} width={100} height={100} style={{ "--i": index }} key={index} alt="poducts Image" />
                                            </>)}
                                        </section>
                                        <section className={styles.details}>
                                            {/* order Details */}
                                            <div className={styles.order_item}>
                                                <strong>Order ID:</strong> <span>{order.razorpayOrderId}</span>
                                            </div>
                                            <div className={styles.order_item}>
                                                <strong>Placed on:</strong> <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className={styles.order_item}>
                                                <strong>Expected delivery:</strong> <span>{new Date(order.deliveredOn || order.expectedDelivery).toLocaleDateString()}</span>
                                            </div>
                                            <div className={styles.order_item}>
                                                <strong>Payment status:</strong> <span>{order?.paymentStatus}</span>
                                            </div>
                                            <div className={styles.order_item}>
                                                <strong>Order status:</strong> <span>{order?.status}</span>
                                            </div>
                                        </section>
                                    </div>
                                </Link>
                            )}
                        </>
                    ))
                )}
            </div>
        </>

    );
}
