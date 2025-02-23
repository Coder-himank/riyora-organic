import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function About() {
  const { t } = useTranslation("common");

  return (
    <div>

      <div className="container">
        <h1>{t("about")}</h1>
        <p>{t("about_text")}</p>
      </div>

    </div>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
