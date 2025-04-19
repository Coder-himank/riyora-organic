import { useTranslation } from "next-i18next";
import { FaEnvelope, FaFacebook, FaInstagram, FaLandmark, FaLocationArrow, FaMailBulk, FaPhone, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbTruckReturn } from "react-icons/tb";
import { IoShieldSharp } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="footer">
      <div className="banner">
        <div className="option"></div>
        <div className="option"></div>
        <div className="option"></div>
        <div className="option"></div>
      </div>
      <div className="footer-content">
        <div className="footer-section">
          <ul>
            <h2>{t("footer.contact.title")}</h2>
            <li><span className="footer_icons"><FaEnvelope /></span> {t("footer.contact.email")}</li>
            <li><span className="footer_icons"><FaPhone /> </span>{t("footer.contact.phone")}</li>
            <li><span className="footer_icons"> <FaLocationDot /> </span>01, Mahaveer Colony, Kherwara, Badla, Udaipur, Rajasthan</li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <h2>{t("footer.support.title")}</h2>
            <li><span className="footer_icons"><RiCustomerService2Line /> </span>{t("footer.support.customer_care")}</li>
            <li><span className="footer_icons"><TbTruckReturn /></span>
              {t("footer.support.return_policy")}</li>
            <li><span className="footer_icons"><IoShieldSharp /></span>
              {t("footer.support.privacy_policy")}</li>
            <li><span className="footer_icons"> <IoMdHelpCircle /></span>
              {t("footer.support.help")}</li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <h2>{t("footer.social.title")}</h2>
            <li><span className="footer_icons"><FaInstagram /></span> Instagarm</li>
            <li><span className="footer_icons"><FaYoutube /> </span>Youtube</li>
            <li><span className="footer_icons"><FaFacebook /> </span>FaceBook</li>
          </ul>
        </div>
      </div>
      <p>{t("footer.copyright")}</p>
    </footer>
  );
}
