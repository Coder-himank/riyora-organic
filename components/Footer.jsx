import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Footer() {
  function subscribe(email) {
    return axios.post("/api/subscribe", {
      email: email,
    });
  }

  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      const response = await subscribe(email);
      setEmail("");
      alert(response.data.message || "Subscribed successfully!");
    } catch (error) {
      alert("Subscription failed.");
    }
  };

  return (
    <footer className="footer">
      <div className="newsLetter">
        <section className="text-content">
          <h2>Subscribe to Our News Letter</h2>
          <p>Get Lates Update On Your Favourite Products and many More</p>
        </section>
        <section className="field">
          <input
            type="text"
            placeholder="Enter Email Address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscirbe</button>
        </section>
      </div>



      <div className="footer-content">
        <div className="footer-section section-1">
          <div className="Footer-logo">
            <Image
              src={"/images/logo.png"}
              width={200}
              height={100}
              alt="Riyora Organic Logo"
            />
          </div>

          <div className="appIcons">


            <div className="app-images payment-opt">
              <Image
                src={"/images/RuPay.png"}
                width={70}
                height={70}
                alt="RuPay Card Logo"
              />
              <Image
                src={"/images/maestro.png"}
                width={70}
                height={70}
                alt="Maestro Card Logo"
              />
              <Image
                src={"/images/master card.png"}
                width={70}
                height={70}
                alt="MasterCard Logo"
              />
              <Image
                src={"/images/visa.png"}
                width={70}
                height={70}
                alt="Visa Card Logo"
              />
            </div>

            <div className="app-images payment-opt">
              <Image
                src={"/images/phonepe.png"}
                width={100}
                height={80}
                alt="PhonePe Logo"
              />
              <Image
                src={"/images/gpay.png"}
                width={100}
                height={80}
                alt="Google Pay Logo"
              />
              <Image
                src={"/images/paytm.png"}
                width={100}
                height={80}
                alt="Paytm Logo"
              />
              <Image
                src={"/images/upi.png"}
                width={100}
                height={80}
                alt="UPI Logo"
              />
            </div>

          </div>
          <div className="otherPlatforms">
            <h2>We are Also Available on</h2>

            <div className="otherPlatformsin">
              <Link
                href={"https://www.amazon.in/dp/B0FS7M9P5B?ref=cm_sw_r_cso_wa_apin_dp_4DFHN65QH7XCDWMPP81A&ref_=cm_sw_r_cso_wa_apin_dp_4DFHN65QH7XCDWMPP81A&social_share=cm_sw_r_cso_wa_apin_dp_4DFHN65QH7XCDWMPP81A"}
                alt={"Amazon Link"}
                target="_blank"
              >

                <Image
                  src={"/images/amazon.png"}
                  alt="Amazon India"
                  width={200}
                  height={100}
                  className="amazon"
                />
              </Link>

              <Link
                href={"https://www.flipkart.com/product/p/itme?pid=HOLHF9BGGYUMSYMC&lid=LSTHOLHF9BGGYUMSYMCCBTP2B&_refId=&_appId=WA"}
                alt={"Flipkart Link"}
                target="_blank"
              >
                <Image
                  src={"/images/flipkart.png"}
                  alt="Flipkart"
                  width={200}
                  height={100}
                  className="flipkart"
                />
              </Link>

              <Link
                href={"https://www.meesho.com/s/p/9hgajf?utm_source=si"}
                alt={"Meesho Link"}
                target="_blank"
              >
                <Image
                  src={"/images/meesho.png"}
                  alt="Amazon India"
                  width={200}
                  height={100}
                  className="meesho"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-section section-2">
          <ul className="footer-links">
            <li>
              <Link href={"/about"}>About Us</Link>
            </li>
            <li>
              <Link href={"/visionAndMission"}>Vision and Mission</Link>
            </li>
            <li>
              <Link href={"/termsAndCondition"}>Terms and Condition</Link>
            </li>
            <li>
              <Link href={"/privacy-policy"}>Privacy Policy</Link>
            </li>
            <li>
              <Link href={"/Faqs"}>FAQs</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section section-3">
          <div className="Footer-logo-mobile">
            <Image
              src={"/images/logo.png"}
              width={200}
              height={100}
              alt="Riyora Organic Logo"
            />
          </div>

          <div className="footer-contact">
            <h2>Contact us</h2>
            <ul>
              <li>
                <span className="footer_icons">
                  <MdEmail />
                </span>{" "}
                care@riyoraorganic.com
              </li>
              <li>
                <span className="footer_icons">
                  <FaPhoneAlt />
                </span>{" "}
                +91 96808 86889
              </li>
              <li>
                <span className="footer_icons">
                  <FaMapMarkerAlt />
                </span>
                <span>
                  LG 61, Manglam Fun Square Mall, Durga Nursery Rd, Udaipur, Rajasthan -313001 India
                </span>
              </li>
            </ul>
          </div>

          <div className="footer-connect">
            <h2>Connect Us</h2>
            <div className="app-images social-app">
              <Link
                href={"https://www.instagram.com/riyoraorganic/"}
                target="_blank"
              >
                <Image
                  src={"/images/instagram.png"}
                  width={100}
                  height={80}
                  alt="follow our Instagram account"
                />
              </Link>
              <Link href={"https://wa.me/9680886889"} target="_blank">
                <Image
                  src={"/images/whatsapp.png"}
                  width={100}
                  height={80}
                  alt="chat with us WhatsApp account"
                />
              </Link>
              <Link href={"https://youtube.com/@riyoraorganic?si=GmKyigJhTDzDvdFL"} target="_blank">
                <Image
                  src={"/images/youtube.png"}
                  width={100}
                  height={80}
                  alt="subscribe our YouTube account"
                />
              </Link>
              <Link href={"https://www.facebook.com/share/1Goa6YijLn/?mibextid=wwXIfr"} target="_blank">
                <Image
                  src={"/images/facebook.png"}
                  width={100}
                  height={80}
                  alt="follow our Facebook account"
                />
              </Link>
              <Link href={" https://x.com/riyoraorganic?s=21"} target="_blank">
                <Image
                  src={"/images/twitter.png"}
                  width={100}
                  height={80}
                  alt="read latest news on Twitter account"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>



      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </footer>
  );
}
