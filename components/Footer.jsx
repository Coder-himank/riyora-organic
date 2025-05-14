
import { FaEnvelope, FaFacebook, FaInstagram, FaLandmark, FaLocationArrow, FaMailBulk, FaPhone, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbTruckReturn } from "react-icons/tb";
import { IoShieldSharp } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import Link from "next/link";
export default function Footer() {


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
            <h2>Contact Us</h2>
            <li><span className="footer_icons"><FaEnvelope /></span> contact@example.com</li>
            <li><span className="footer_icons"><FaPhone /></span> +91 12345 67890</li>
            <li><span className="footer_icons"><FaLocationDot /></span> 01, Mahaveer Colony, Kherwara, Badla, Udaipur, Rajasthan</li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <h2>Support</h2>
            <li><Link href={"/support#customer_care"}><span className="footer_icons"><RiCustomerService2Line /></span> Customer Care</Link></li>
            <li><Link href={"/support#return_policy"}><span className="footer_icons"><TbTruckReturn /></span> Return Policy</Link></li>
            <li><Link href={"/support#privacy_policy"}><span className="footer_icons"><IoShieldSharp /></span> Privacy Policy</Link></li>
            <li><Link href={"/support#help"}><span className="footer_icons"><IoMdHelpCircle /></span> Help</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <h2>Follow Us</h2>
            <li><span className="footer_icons"><FaInstagram /></span> Instagram</li>
            <li><span className="footer_icons"><FaYoutube /></span> YouTube</li>
            <li><span className="footer_icons"><FaFacebook /></span> Facebook</li>
          </ul>
        </div>
      </div>
      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </footer>

  );
}
