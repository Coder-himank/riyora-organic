import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "@/styles/track-order.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function TrackOrder() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { orderId } = router.query;
    const { data: session } = useSession();

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
            const { data } = await axios.get(`/api/orders?orderId=${id === "all" ? "" : id}&userId=${userId}`);
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
                <h1>{t("track_order")}</h1>

                {loading ? (
                    <div className={styles.order_skeleton}>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className={styles.order_item_skeleton}>
                                <div className={styles.order_text_skeleton}></div>
                            </div>
                        ))}
                    </div>
                ) : orderDetails.length === 0 ? (
                    <p>{t("no_orders_to_track")}</p>
                ) : (
                    orderDetails.map((order) => (
                        <div className={styles.order_detail} key={order.orderId}>
                            <div className={styles.order_item}>
                                <strong>{t("order_id")}:</strong> <span>{order.orderId}</span>
                            </div>
                            <div className={styles.order_item}>
                                <strong>{t("placed_on")}:</strong> <span>{new Date(order.placedOn).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.order_item}>
                                <strong>{t("expected_delivery")}:</strong> <span>{new Date(order.expectedDelivery).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.order_item}>
                                <strong>{t("payment_status")}:</strong> <span>{t(order.paymentStatus)}</span>
                            </div>
                            <div className={styles.order_item_status}>
                                <strong>{t("order_status")}:</strong> <span>{t(order.statusHistory.status)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

// Use getServerSideProps for dynamic data fetching
export async function getServerSideProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}