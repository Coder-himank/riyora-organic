import styles from "@/styles/order-page.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

export const Orders = () => {
    const { data: session } = useSession();
    const [ordersData, setOrdersData] = useState(null);
    const [error, setError] = useState(null);
    const { query } = useRouter();

    useEffect(() => {
        async function fetchOrdersData(userId = session?.user?.id) {
            if (!userId) return;
            try {
                const response = await axios.get(`/api/secure/orders?userId=${userId}&status=${query.status || undefined}`);
                setOrdersData(response.data.orderDetails);
            } catch (error) {
                setOrdersData([]);
                setError(error);
            }
        }
        fetchOrdersData(session?.user?.id);
    }, [session?.user]);

    if (error) {
        return <p>{t("ordersPage.error")}: {error.message}</p>;
    }

    return (
        <div className={styles.orders_container}>
            <div className="navHolder"></div>
            <h1>Orders</h1>

            <div className={styles.orders_list}>
                {ordersData === null ? (
                    <SkeletonLoading />
                ) : ordersData.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    ordersData.map((order) => (
                        <div key={order._id} className={styles.order_item}>
                            <div className={styles.order_head}><span>{order._id}</span> <span>₹{order.amount}</span></div>

                            <div className={styles.order_products}>
                                {order.products.map((product, index) => (
                                    <div key={index} className={styles.product_plate}>
                                        <Image
                                            src={product.imageUrl || "/images/placeholderProduct.png"}
                                            width={100}
                                            height={100}
                                            alt={`Product ${index + 1}`}
                                        />
                                        <span>Quantity: {product.quantity}</span>
                                        <span>Price : ₹{product.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.order_details}>
                                <span>Payment Status: {order.paymentStatus}</span>
                                <span>Placed on: {new Date(order.placedOn).toLocaleDateString()}</span>
                                <span>Expected Delivery: {new Date(order.expectedDelivery).toLocaleDateString()}</span>
                                <span>Status: {order.statusHistory?.[order.statusHistory.length - 1]?.status || "Unknown"}</span>
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