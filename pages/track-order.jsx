import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "@/styles/track-order.module.css";
import axios from "axios";

export default function TrackOrder() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { orderId } = router.query;

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (id) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/orders?orderId=${id}`);
            setOrderDetails(data.orderDetails);
        } catch (err) {
            setError(t("error_fetching_order"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>{t("loading")}</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.track_order_container}>
            <h1>{t("track_order")}</h1>
            {orderDetails ? (
                <div className={styles.order_detail}>
                    <div className={styles.order_item}>
                        <strong>{t("order_id")}:</strong> {orderDetails.orderId}
                    </div>
                    <div className={styles.order_item}>
                        <strong>{t("placed_on")}:</strong> {new Date(orderDetails.placedOn).toLocaleDateString()}
                    </div>
                    <div className={styles.order_item}>
                        <strong>{t("expected_delivery")}:</strong> {new Date(orderDetails.expectedDelivery).toLocaleDateString()}
                    </div>
                    <div className={styles.order_item}>
                        <strong>{t("payment_status")}:</strong> {t(orderDetails.paymentStatus)}
                    </div>
                    <div className={styles.order_item}>
                        <strong>{t("delivery_status")}:</strong> {t(orderDetails.deliveryStatus)}
                    </div>
                </div>
            ) : (
                <p>{t("order_not_found")}</p>
            )}
        </div>
    );
}

// Use getServerSideProps for dynamic data fetching
export async function getServerSideProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
