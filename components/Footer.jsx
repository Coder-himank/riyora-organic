import { useTranslation } from "next-i18next";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="footer">
      <p>{t("footer.copyright")}</p>
    </footer>
  );
}
