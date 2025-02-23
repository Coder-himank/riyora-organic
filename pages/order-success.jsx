import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function OrderSuccess() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { orderId } = router.query;

    // Redirect user to the track order page after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push({ pathname: `/track-order/`, query: { orderId } });
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timer); // Clear timeout on unmount
    }, [router]);

    return (
        <div className="order-success-container">
            <h1>{t("order_success")}</h1>
            <p>{t("thank_you_for_your_order")}</p>
            <p>{t("you_will_be_redirected_to_track_order_page")}</p>
            <p>{t("redirect_in_5_seconds")}</p>
            {/* You can also display the order details here, if available */}
            {/* Example: */}
            <p>{t("order_id")}: {orderId}</p>
        </div>
    );
}

// i18n Support for translations
export async function getStaticProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
