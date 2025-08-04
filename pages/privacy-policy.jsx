import React from "react";
import style from "@/styles/PrivacyPolicy.module.css";
import Head from "next/head";
import Image from "next/image";
const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Riyora Organic Hair Oil</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Riyora Organic Hair Oil. Learn how we collect, use, and protect your personal data when you shop for natural hair oil at riyora-organic.vercel.app."
        />
        <meta
          name="keywords"
          content="Riyora Organic, hair oil, natural hair oil, privacy policy, organic hair care, data protection, riyora-organic.vercel.app"
        />
        <meta property="og:title" content="Privacy Policy | Riyora Organic Hair Oil" />
        <meta
          property="og:description"
          content="Discover how Riyora Organic Hair Oil protects your privacy and personal data. Shop confidently for natural hair oil at riyora-organic.vercel.app."
        />
        <meta property="og:url" content="https://riyora-organic.vercel.app/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/riyora-hair-oil-og.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://riyora-organic.vercel.app/privacy-policy" />
      </Head>
      <div className={style.container}>
        <div className={style.header}>
          <h1 className={style.title}>Privacy Policy</h1>
          <p className={style.updated}>Last updated: July 29, 2025</p>
          <p className={style.text}>
            Welcome to Riyora Organic, your trusted source for premium natural hair oil. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website:{" "}
            <a href="https://riyora-organic.vercel.app/" target="_blank" rel="noopener noreferrer">
              https://riyora-organic.vercel.app/
            </a>.
          </p>
        </div>
        <div className={style.policies}>
          <section>
            <h3 className={style.heading}>1. Information We Collect</h3>
            <p className={style.text}>
              We collect personal information you provide when you register, place an order for Riyora Organic Hair Oil, or contact us. This includes:
            </p>
            <ul className={style.list}>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping address</li>
            </ul>
          </section>
          <section>
            <h3 className={style.heading}>2. Payment Information</h3>
            <p className={style.text}>
              All payments for Riyora Organic Hair Oil are processed securely through Razorpay. Your payment details are never stored on our servers.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>3. Use of Your Information</h3>
            <p className={style.text}>We may use your information to:</p>
            <ul className={style.list}>
              <li>Process and fulfill your Riyora Organic Hair Oil orders</li>
              <li>Send order confirmations and updates</li>
              <li>Respond to customer service requests</li>
              <li>Send promotional emails or newsletters (with your consent)</li>
              <li>Improve our website and user experience</li>
            </ul>
          </section>
          <section>
            <h3 className={style.heading}>4. Tracking & Cookies</h3>
            <p className={style.text}>
              We use cookies to store user credentials and enhance your browsing experience on Riyora Organic. These may also be used for analytics and personalized advertising.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>5. Analytics and Tracking Tools</h3>
            <p className={style.text}>
              We use Google Analytics and Facebook Pixel to monitor website performance and user interaction. These tools may collect anonymized data such as device information, IP address, browser type, and site activity.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>6. Third-Party Services</h3>
            <p className={style.text}>
              We may share your data with trusted third parties, including:
            </p>
            <ul className={style.list}>
              <li>Razorpay (for payment processing)</li>
              <li>DTDC Courier (for order delivery)</li>
              <li>Email marketing platforms (to send opt-in communications)</li>
            </ul>
          </section>
          <section>
            <h3 className={style.heading}>7. User Consent</h3>
            <p className={style.text}>
              By using our site and submitting your information, you consent to the collection and use of your personal data as outlined in this policy. Marketing messages are only sent to users who have explicitly opted in.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>8. Children's Privacy</h3>
            <p className={style.text}>
              Our website is not intended for users under the age of 16. We do not knowingly collect or store personal information from children.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>9. Data Security</h3>
            <p className={style.text}>
              We take appropriate security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>10. Your Rights</h3>
            <p className={style.text}>
              You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional emails at any time.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>11. Changes to This Policy</h3>
            <p className={style.text}>
              We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with a revised “Last Updated” date.
            </p>
          </section>
          <section>
            <h3 className={style.heading}>12. Contact Us</h3>
            <p className={style.text}>
              If you have any questions or concerns about this Privacy Policy or about Riyora Organic Hair Oil, please contact us at:{" "}
              <a href="mailto:info@riyoraorganic.com">info@riyoraorganic.com</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
