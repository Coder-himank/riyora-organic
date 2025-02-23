import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import "@/styles/privacy-policy.module.css";

export default function PrivacyPolicy() {
  const { t } = useTranslation("common");

  return (
    <div>

      <div className="container">
        <h1>{t("privacy_policy")}</h1>
        <p>{t("privacy_policy_text")}</p>
      </div>

    </div>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
