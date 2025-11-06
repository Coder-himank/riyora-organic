import React, { useState } from "react";
import styles from "@/styles/PrivacyPolicy.module.css";
import Head from "next/head";

export default function PrivacyPolicy() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  return (
    <>
      <Head>
        {/* Primary SEO Tags */}
        <title>Privacy Policy | Riyora Organic</title>
        <meta
          name="description"
          content="Read Riyora Organic's Privacy Policy to understand how we collect, use, and protect your personal information. Compliant with Indian data protection laws."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Riyora Organic, Data Protection, Personal Information, Cookies, GDPR, IT Act India, PDPB"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://riyoraorganic.com/privacy-policy" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | Riyora Organic" />
        <meta
          property="og:description"
          content="Understand how Riyora Organic collects, uses, and protects your data. Privacy Policy compliant with Indian laws and best practices."
        />
        <meta property="og:url" content="https://riyoraorganic.com/privacy-policy" />
        <meta property="og:image" content="https://riyoraorganic.com/images/privacy-og.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Riyora Organic" />
        <meta
          name="twitter:description"
          content="Riyora Organic's Privacy Policy explains how your personal data is collected, used, and secured. Fully compliant and transparent."
        />
        <meta name="twitter:image" content="https://riyoraorganic.com/images/privacy-og.jpg" />

        {/* Structured Data: WebPage + LegalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Privacy Policy",
              "url": "https://riyoraorganic.com/privacy-policy",
              "description": "Riyora Organic Privacy Policy explains how we collect, use, and protect personal information. Compliant with IT Act 2000 and PDPB 2019.",
              "publisher": {
                "@type": "Organization",
                "name": "Riyora Organic",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://riyoraorganic.com/Riyora-Logo-Favicon.png"
                }
              }
            })
          }}
        />
      </Head>

      <main className={styles.container}>
        <article className={styles.article}>
          {/* Header Section */}
          <div className={styles.header}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.date}>Effective Date: 19th October, 2025</p>
            <p className={styles.intro}>
              Thank you for visiting our website. This policy explains how Riyora Organic collects, uses, discloses, and protects your personal information when you use our Website and services.
            </p>
          </div>

          {/* Policy Sections */}
          <section>
            <h2>1. Scope of this Policy</h2>
            <p>This Privacy Policy applies to all users of our Website, online store, social media pages, and other online services operated by Riyora Organic.</p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>a. Personal Information</h3>
            <ul>
              <li>Name, phone number, email address, shipping and billing address</li>
              <li>Account details and login credentials (if applicable)</li>
              <li>Communication preferences, reviews, and customer feedback</li>
            </ul>

            <h3>b. Financial Information</h3>
            <p>Payment details are securely processed by third-party payment gateways. Riyora Organic does not store or access your financial information.</p>

            <h3>c. Technical & Usage Information</h3>
            <ul>
              <li>IP address, device type, browser type, operating system</li>
              <li>Browsing behavior, location data, and cookies</li>
              <li>Website interaction, analytics, and session data</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>Process and fulfill orders, payments, and deliveries</li>
              <li>Send order updates, invoices, and confirmations</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve products, services, and website experience</li>
              <li>Personalize your experience and display relevant content</li>
              <li>Marketing and promotional communications (with consent)</li>
              <li>Fraud prevention and data security compliance</li>
              <li>Analyze usage trends to improve website performance</li>
            </ul>
          </section>

          <section>
            <h2>4. Sharing of Information</h2>
            <ul>
              <li><strong>Service Providers:</strong> Payment gateways, shipping, logistics, IT support</li>
              <li><strong>Advertising Partners:</strong> Google, Meta for remarketing or personalized ads</li>
              <li><strong>Analytics & Cloud Providers:</strong> Data storage and performance analysis</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <p><strong>We do not sell or rent your personal information to anyone.</strong></p>
          </section>

          <section>
            <h2>5. User Rights & Choices</h2>
            <ul>
              <li>Access, update, or delete personal information</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Opt-out of cookies or targeted advertising</li>
              <li>Request information on data processing</li>
            </ul>
            <p>Contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> to exercise your rights.</p>
          </section>

          <section>
            <h2>6. Cookies & Tracking Technologies</h2>
            <ul>
              <li>Enable essential website functions</li>
              <li>Analyze traffic and performance</li>
              <li>Deliver relevant advertisements</li>
            </ul>
            <p>By using our Website, you consent to cookies. You may disable cookies in your browser, but some features may not work.</p>
          </section>

          <section>
            <h2>7. Data Security</h2>
            <ul>
              <li>SSL encryption for secure transactions</li>
              <li>Restricted access by authorized personnel only</li>
              <li>Regular monitoring and system updates</li>
            </ul>
            <p>While we follow strict practices, absolute security cannot be guaranteed.</p>
          </section>

          <section>
            <h2>8. Policy Updates</h2>
            <p>Privacy Policy may be updated periodically. Continued use signifies acceptance of changes.</p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <address>
              Riyora Organic<br />
              Unit: LG 61, Manglam Fun Square Mall, Durga Nursery Road,<br />
              Udaipur, Rajasthan – 313001<br />
              Email: <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>
            </address>
          </section>

          <section>
            <h2>10. Legal Compliance</h2>
            <p>This Privacy Policy complies with applicable Indian data protection laws, including the IT Act 2000 and Personal Data Protection Bill (PDPB) 2019.</p>
          </section>

          <footer className={styles.footer}>
            <p>
              Questions or concerns? Contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>.
            </p>
          </footer>
        </article>

        {/* Cookie Banner */}
        {showCookieBanner && (
          <div className={styles.cookieBanner}>
            <div>
              <p>We use cookies to improve your experience.</p>
              <p>By continuing, you agree to our use of cookies.</p>
            </div>
            <div className={styles.cookieButtons}>
              <button onClick={() => setShowCookieBanner(false)}>Accept</button>
              <a href="#cookies">Manage</a>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
