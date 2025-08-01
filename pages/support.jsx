 import React from 'react';
import styles from "@/styles/support.module.css";
import Head from "next/head";
import Image from "next/image";
const Support = () => {
    return (
        <>
            <Head>
                <title>Support | Riyora Organic Hair Oil</title>
                <meta name="description" content="Get support for Riyora Organic Hair Oil. Find answers to your questions, learn about our return policy, privacy policy, and how to contact our customer care team." />
                <meta name="keywords" content="Riyora Organic, Hair Oil, Support, Customer Care, Returns, Privacy Policy, FAQ, Organic Hair Care" />
                <meta property="og:title" content="Support | Riyora Organic Hair Oil" />
                <meta property="og:description" content="Contact Riyora Organic for support, returns, privacy policy, and more. We're here to help you with your hair care journey." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://riyora-organic.vercel.app/support" />
                <meta property="og:image" content="/images/riyora-hair-oil-banner.jpg" />
            </Head>
            <div className={styles.banner}>
                <Image
                    src="/images/riyora-hair-oil-banner.jpg"
                    alt="Riyora Organic Hair Oil Banner"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
            <div className={styles.support_container}>
                <h1>Support - Riyora Organic Hair Oil</h1>
                <p>
                    Welcome to Riyora Organic's support page. We are dedicated to helping you achieve healthy, beautiful hair with our premium organic hair oil. If you have questions about our products, orders, or need assistance, our team is here for you.
                </p>

                <section className={styles.support_section}>
                    <h2>Customer Care</h2>
                    <p>
                        Our customer care specialists are available to assist you with product inquiries, order tracking, and personalized hair care advice. Email us at <a href="mailto:support@riyora-organic.com" style={{ color: 'blue', textDecoration: 'underline' }}>support@riyora-organic.com</a> or call <a href="tel:1234567890" style={{ color: 'blue', textDecoration: 'underline' }}>(123) 456-7890</a>.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Return Policy</h2>
                    <p>
                        We want you to love your Riyora Organic Hair Oil. If you're not satisfied, you can return your purchase within 30 days. Visit our <a href="/returns" style={{ color: 'blue', textDecoration: 'underline' }}>Returns Page</a> or contact our support team for assistance.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Privacy Policy</h2>
                    <p>
                        Your privacy matters to us. Learn how we protect your personal information by reviewing our <a href="/privacy-policy" style={{ color: 'blue', textDecoration: 'underline' }}>Privacy Policy</a>.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Help & FAQs</h2>
                    <p>
                        Need help with your Riyora Organic Hair Oil order or have questions about our ingredients? Visit our <a href="/faq" style={{ color: 'blue', textDecoration: 'underline' }}>FAQ Page</a> or reach out to our support team for expert assistance.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Support;