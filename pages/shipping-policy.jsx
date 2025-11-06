import React from "react";
import styles from "@/styles/shiping-policy.module.css";
import Head from "next/head";

export default function ShippingPolicy() {
    return (
        <>
            <Head>
                {/* Primary SEO Tags */}
                <title>Riyora Organic Shipping Policy | Delivery & Tracking Information</title>
                <meta
                    name="description"
                    content="Learn about Riyora Organic's shipping policy. Free domestic shipping above ₹499, international delivery details, tracking, delivery timelines, and order processing for organic hair care products."
                />
                <meta
                    name="keywords"
                    content="Riyora Organic, shipping policy, delivery policy, order tracking, organic hair oil, international shipping, free shipping India, courier partners, delivery timelines"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://riyoraorganic.com/shipping-policy" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Riyora Organic Shipping Policy | Delivery & Tracking Information" />
                <meta property="og:description" content="Riyora Organic offers free domestic shipping above ₹499, reliable international delivery, order tracking, and timely processing for all organic hair care products." />
                <meta property="og:image" content="https://riyoraorganic.com/images/riyora-hair-oil-banner.jpg" />
                <meta property="og:url" content="https://riyoraorganic.com/shipping-policy" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Riyora Organic Shipping Policy | Delivery & Tracking Information" />
                <meta name="twitter:description" content="Discover Riyora Organic's shipping policy including domestic free shipping, international delivery, order tracking, and processing timelines for organic hair care products." />
                <meta name="twitter:image" content="https://riyoraorganic.com/images/riyora-hair-oil-banner.jpg" />

                {/* Structured Data: WebPage */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Riyora Organic Shipping Policy",
                            "description": "Riyora Organic provides detailed shipping policies including domestic and international delivery, free shipping offers, tracking, and order processing.",
                            "url": "https://riyoraorganic.com/shipping-policy",
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
                    <div className={styles.header}>
                        <h1 className={styles.title}>Shipping Policy</h1>
                        <p className={styles.date}>Effective Date: 12th October 2025</p>
                        <p className={styles.intro}>
                            At Riyora Organic, we are committed to delivering your orders promptly and efficiently.
                            Please read our shipping policy carefully to understand our delivery timelines, charges,
                            and procedures.
                        </p>
                    </div>

                    <section>
                        <h2>Domestic Shipping (Within India)</h2>
                        <ul>
                            <li><strong>Free Shipping:</strong> We offer free shipping on all orders above ₹499 within India.</li>
                            <li><strong>Delivery Time:</strong> Orders are typically delivered within 7–15 business days from dispatch, depending on location and other circumstances.</li>
                            <li><strong>Order Processing:</strong> Orders are processed and dispatched within 2–3 business days, subject to stock availability.</li>
                            <li><strong>Courier Partners:</strong> We work with reliable logistics partners to ensure safe and timely delivery.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>International Shipping</h2>
                        <ul>
                            <li><strong>Shipping Charges:</strong> International shipping varies by destination country and is calculated at checkout.</li>
                            <li><strong>Delivery Time:</strong> International orders may take up to 30 days depending on destination and customs clearance.</li>
                            <li><strong>Custom Duties & Taxes:</strong> Customs duties, import taxes, and additional fees are the responsibility of the customer and payable to the courier.</li>
                            <li><strong>Non-Delivery Assistance:</strong> Contact <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> if your order is delayed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Order Tracking</h2>
                        <ul>
                            <li>A tracking link will be shared via email or SMS once your order ships.</li>
                            <li>Contact customer support if tracking details are not received within 3 days of order placement.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Important Information</h2>
                        <ul>
                            <li>Notify us within 24 hours if your delivery status shows “Delivered” but you haven’t received your package.</li>
                            <li>Riyora Organic is not responsible for delays due to natural calamities, strikes, lockdowns, or other unforeseen events.</li>
                            <li>Returned shipments due to incorrect address or refusal will incur reshipping costs borne by the customer.</li>
                            <li>Original shipping charges are deducted from refunds for returned shipments.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Contact Us</h2>
                        <p>
                            For any shipping queries or concerns, please reach out at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>.
                        </p>
                        <p>
                            We appreciate your trust and look forward to serving you with care and dedication.
                        </p>
                    </section>
                </article>
            </main>
        </>
    );
}
