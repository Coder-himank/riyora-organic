
import { FaEnvelope, FaFacebook, FaInstagram, FaLandmark, FaLocationArrow, FaMailBulk, FaPhone, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RiCustomerService2Line } from "react-icons/ri";
import { FaPhoneAlt } from 'react-icons/fa';
import { TbTruckReturn } from "react-icons/tb";
import { MdEmail } from 'react-icons/md';
import { IoShieldSharp } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {


  return (
    <footer className="footer">

      <div className="footer-content">
        <div className="footer-section section-1">
          <div className="Footer-logo">
            {/* Logo */}
            <Image src={"/images/logo.png"} width={200} height={100} />
          </div>

          <div className="app-images payment-opt">
            {/* card type support */}
            <Image src={"/images/RuPay.png"} width={70} height={70} />
            <Image src={"/images/maestro.png"} width={70} height={70} />
            <Image src={"/images/master card.png"} width={70} height={70} />
            <Image src={"/images/visa.png"} width={70} height={70} />
          </div>
          <div className="app-images payment-opt">
            {/* upi app support */}
            <Image src={"/images/phonepe.png"} width={100} height={80} />
            <Image src={"/images/gpay.png"} width={100} height={80} />
            <Image src={"/images/paytm.png"} width={100} height={80} />
            <Image src={"/images/upi.png"} width={100} height={80} />
          </div>

        </div>
        <div className="footer-section section-2">
          <ul className="footer-links">
            <li><Link href={"/support#customer_care"}>About Us</Link></li>
            <li><Link href={"/support#return_policy"}>Contact Us</Link></li>
            <li><Link href={"/support#privacy_policy"}>Vision and Mission</Link></li>
            <li><Link href={"/support#help"}>Terms and Condition</Link></li>
            <li><Link href={"/support#help"}>Privacy Policy</Link></li>
            <li><Link href={"/support#help"}>FAQs</Link></li>
          </ul>
        </div>
        <div className="footer-section section-3">
          <div className="footer-contact">
            <h4>Contact us</h4>
            <ul>
              <li><span className="footer_icons"><MdEmail /></span> info@riyoraorganic.com</li>
              <li><span className="footer_icons"><FaPhoneAlt /></span> +91 96808 86889</li>
              <li><span className="footer_icons"><FaMapMarkerAlt /></span><span>
                61 LG, Manglam Fun Square Mall,
                Durga Nursery Rd, Shakti Nagar
                Udaipur , Rajasthan -313001 India
              </span>
              </li>
            </ul>
          </div>
          <div className="footer-connect">
            <h4>Connect Us</h4>
            <div className="app-images social-app">

              <Link href={"https://www.instagram.com/riyoraorganic/"} target="_blank">
                <Image src={"/images/instagram.png"} width={100} height={80} />
              </Link>
              <Link href={"https://wa.me/919521666123"} target="_blank">
                <Image src={"/images/whatsapp.png"} width={100} height={80} />
              </Link>
              <Link href={"/"}>
                <Image src={"/images/youtube.png"} width={100} height={80} />
              </Link>
              <Link href={"/"}>
                <Image src={"/images/facebook.png"} width={100} height={80} />
              </Link>
              <Link href={"/"}>
                <Image src={"/images/twitter.png"} width={100} height={80} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </footer>

  );
}
