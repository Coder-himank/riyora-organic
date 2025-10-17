import React, { useState } from "react";
import styles from "@/styles/PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  return (
    <main className={styles.container}>
      <article className={styles.article}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.date}>Effective Date: 19th October, 2025</p>
          <p className={styles.intro}>Thank you for visiting our website. This policy explains how Riyora Organic collects, uses, discloses, and protects your personal information when you use our Website and services.</p>
        </div>

        <section>
          <h2>1. Scope of this Policy</h2>
          <p>This Privacy Policy applies to all users of our Website, online store, social media pages, and any other digital or online services operated by Riyora Organic.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <div>
            <h3>a. Personal Information</h3>
            <ul>
              <li>Name, phone number, email address, shipping and billing address</li>
              <li>Account details and login credentials (if applicable)</li>
              <li>Communication preferences, reviews, and customer feedback</li>
            </ul>

            <h3>b. Financial Information</h3>
            <p>Payment details such as credit/debit card, UPI, or other payment methods. <strong>Note:</strong> All transactions are securely processed by third-party payment gateways. Riyora Organic does not store or access your financial information.</p>

            <h3>c. Technical & Usage Information</h3>
            <ul>
              <li>IP address, device type, browser type, operating system</li>
              <li>Browsing behavior, location data, and cookies</li>
              <li>Website interaction, analytics, and session data</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill your orders, payments, and deliveries</li>
            <li>To send order updates, invoices, and transaction confirmations</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To improve our products, services, and overall user experience</li>
            <li>To personalize your experience and display relevant content</li>
            <li>For marketing, promotional emails, and targeted advertisements</li>
            <li>For fraud prevention, data security, and compliance with applicable laws</li>
            <li>To analyze usage trends and improve our Website performance</li>
          </ul>
        </section>

        <section>
          <h2>4. Sharing of Information</h2>
          <p>We may share your personal data with trusted third parties, including:</p>
          <ul>
            <li><strong>Service Providers:</strong> Payment gateways, shipping partners, logistics providers, and IT support companies</li>
            <li><strong>Advertising Partners:</strong> Google, Meta, and other platforms for remarketing or personalized advertisements</li>
            <li><strong>Analytics & Cloud Providers:</strong> To analyze performance and store data securely</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights, property, or safety</li>
          </ul>
          <p><strong>We do not sell or rent your personal information to anyone.</strong></p>
        </section>

        <section>
          <h2>5. User Rights & Choices</h2>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Withdraw consent for marketing or promotional communications</li>
            <li>Opt out of cookies or targeted advertising via your browser settings</li>
            <li>Request information on how your data is processed</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>. We will respond to legitimate requests within 30 days.</p>
        </section>

        <section>
          <h2>6. Cookies & Tracking Technologies</h2>
          <ul>
            <li>Enable essential website functions and improve user experience</li>
            <li>Analyze traffic and measure website performance</li>
            <li>Deliver relevant advertisements (e.g., Google Ads, Meta Ads)</li>
          </ul>
          <p>By using our Website, you consent to the use of cookies in accordance with this Privacy Policy. You may disable cookies in your browser settings; however, some features may not function properly.</p>
        </section>

        <section>
          <h2>7. Data Security</h2>
          <ul>
            <li>SSL encryption for secure online transactions</li>
            <li>Restricted access to personal data by authorized personnel only</li>
            <li>Regular monitoring and updates to our systems for enhanced protection</li>
          </ul>
          <p>While we follow strict data protection practices, no method of transmission or storage is completely secure. Therefore, we cannot guarantee absolute security of your data.</p>
        </section>

        <section>
          <h2>8. Policy Updates</h2>
          <p>We may update this Privacy Policy periodically. Revised versions will be posted on this page with an updated Effective Date. Continued use of our Website after any changes signifies your acceptance of the updated policy.</p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <address>
            <p>Riyora Organic</p>
            <p>Unit: LG 61, Manglam Fun Square Mall, Durga Nursery Road,</p>
            <p>Udaipur, Rajasthan – 313001</p>
            <p>Email: <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a></p>
          </address>
        </section>

        <section>
          <h2>10. Legal Compliance</h2>
          <p>This Privacy Policy complies with applicable Indian data protection laws, including the Information Technology (IT) Act, 2000, and the Personal Data Protection Bill (PDPB), 2019.</p>
        </section>

        <footer className={styles.footer}>
          <p>If you have questions or concerns related to your personal data, please contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>.</p>
        </footer>
      </article>

      {showCookieBanner && (
        <div className={styles.cookieBanner}>
          <div>
            <p>We use cookies to improve your experience.</p>
            <p>By continuing to use this site, you agree to our use of cookies in accordance with our Privacy Policy.</p>
          </div>
          <div className={styles.cookieButtons}>
            <button onClick={() => setShowCookieBanner(false)}>Accept</button>
            <a href="#cookies">Manage</a>
          </div>
        </div>
      )}
    </main>
  );
}
