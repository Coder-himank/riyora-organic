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
                setOrdersData(response.data.orderDetails);
            } catch (error) {
                setOrdersData([]);
                setError(error);
            }
        }
        fetchOrdersData(session?.user?.id);
    }, [session?.user, query.status]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const shouldDisplayOrder = (order) => {
        const statusQuery = query?.status;
        console.log("Query Status:", statusQuery);
        
        console.log("Status Query:", statusQuery, "Order Status:", order?.status);

        if (!statusQuery) return true;
        if (statusQuery === "all_orders") return true;
        if (statusQuery === "canceled" && order?.status === "cancelled") return true;
        // if (statusQuery === "undelivered_or_old") {
        //     const isNotDelivered = order?.status !== "delivered";
        //     const deliveredMoreThan30DaysAgo =
        //         order?.deliveredOn &&
        //         new Date(order.deliveredOn) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        //     return isNotDelivered || deliveredMoreThan30DaysAgo;
        // }
        return false;
    };

    if (error) {
        return <p>Error loading orders: {error.message}</p>;
    }

    const filteredOrders = ordersData?.filter(shouldDisplayOrder) || [];

    return (
        <div className={styles.orders_container}>
            <div className="navHolder"></div>
            <h1>Orders</h1>

            <div className={styles.orders_list}>
                {ordersData === null ? (
                    <SkeletonLoading />
                ) : filteredOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className={styles.order_item} id={order._id}>
                            <div className={styles.order_head}>
                                <span>{order._id}</span>
                                <span>₹{order.amount}</span>
                            </div>

                            <div className={styles.order_products}>
                                {order.products.map((product, index) => (
                                    <div key={index} className={styles.product_plate}>
                                        <Link href={`/products/${product.productId}`}>
                                            <Image
                                                src={product.imageUrl || "/images/placeholderProduct.png"}
                                                width={100}
                                                height={100}
                                                alt={`Product ${index + 1}`}
                                            />
                                        </Link>
                                        <span>Quantity: {product.quantity}</span>
                                        <span>Price : ₹{product.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.order_details}>
                                <span>Payment Status: {order.paymentStatus}</span>
                                <span>Placed on: {formatDate(order.placedOn)}</span>
                                <span>Expected Delivery: {formatDate(order.expectedDelivery)}</span>
                                <span>Status: {order.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const SkeletonLoading = () => {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.order_item}>
                    <div className={styles.skeleton_order_head}></div>
                    <div className={styles.order_products}>
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <div key={idx} className={styles.product_plate}>
                                <div className={styles.skeleton_img}></div>
                                <span className={styles.skeleton_small_text_1}></span>
                                <span></span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.order_details}>
                        <span className={styles.skeleton_small_text}></span>
                        <span className={styles.skeleton_small_text}></span>
                        <span className={styles.skeleton_small_text}></span>
                        <span className={styles.skeleton_small_text}></span>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Orders;
