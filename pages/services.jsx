import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Services() {
    const { t } = useTranslation("common");

    return (
        <div>
            <div className="navHolder"></div>
            <div className="services_container">
                <h1>{t("services")}</h1>
                <p>{t("services_text")}</p>
            </div>

        </div>
    );
}

// i18n Support
export async function getStaticProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}