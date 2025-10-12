import React from "react";
import Head from "next/head";
import styles from "@/styles/PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Riyora Organic</title>
        <meta
          name="description"
          content="Privacy Policy for Riyora Organic — learn how we collect, use, and protect your information."
        />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <section className={styles.section}>
          <p>
            Welcome to <strong>Riyora Organic</strong> (“we”, “our”, “us”). This
            Privacy Policy explains how we collect, use, and protect your
            personal information when you visit or make a purchase from{" "}
            <a href="https://riyoraorganic.com" target="_blank" rel="noopener noreferrer">
              riyoraorganic.com
            </a>
            .
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Personal details:</strong> such as your name and email
              address when you make a purchase or subscribe to our newsletter.
            </li>
            <li>
              <strong>Usage data:</strong> collected automatically through
              cookies, Google Analytics, and similar technologies.
            </li>
            <li>
              <strong>Communication data:</strong> when you contact us for
              support or inquiries.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Process and fulfill your orders.</li>
            <li>Send you updates about your purchase or delivery.</li>
            <li>Improve our website, products, and user experience.</li>
            <li>Send promotional or newsletter emails (only with your consent).</li>
            <li>Analyze website traffic using Google Analytics.</li>
          </ul>

          <h2>3. Cookies & Analytics</h2>
          <p>
            Our website uses cookies and Google Analytics to help us understand
            visitor behavior and improve our services. Cookies are small data
            files stored on your device. You can disable cookies in your browser
            settings, but some parts of the website may not function properly.
          </p>

          <h2>4. Data Sharing & Disclosure</h2>
          <p>
            We do not sell or rent your personal information. We may share data
            only with trusted third-party service providers (e.g., payment
            processors, logistics partners) who assist us in running our
            business — and only as necessary to provide their services.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We use appropriate security measures to protect your personal data
            against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>6. Your Rights</h2>
          <p>Under applicable laws in India, you have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal information.</li>
            <li>Withdraw consent for marketing communications.</li>
            <li>Request details of how your information is used.</li>
          </ul>

          <h2>7. Newsletter & Marketing Emails</h2>
          <p>
            If you subscribe to our newsletter, we will use your email address
            to send you information about new products, offers, or wellness
            tips. You may unsubscribe at any time by clicking the “unsubscribe”
            link in any email or contacting us directly.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites. We are not
            responsible for the privacy practices or content of those sites.
          </p>

          <h2>9. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in
            our practices or legal requirements. The updated version will be
            posted on this page with a new “Last Updated” date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            For questions or concerns about this Privacy Policy or your personal
            data, please contact us:
          </p>

          <div className={styles.contactBox}>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+919680886889">+91 96808 86889</a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://riyoraorganic.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                riyoraorganic.com
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
