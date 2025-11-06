import React from "react";
import styles from "@/styles/refund-policy.module.css";
import Head from "next/head";

export default function ReturnRefundPolicy() {
    return (
        <>
            <Head>
                {/* Primary SEO Tags */}
                <title>Return, Refund, Cancellation & Exchange Policy | Riyora Organic</title>
                <meta
                    name="description"
                    content="Learn about Riyora Organic's Return, Refund, Cancellation, and Exchange Policy. Understand how to request returns, refunds, and cancellations easily."
                />
                <meta
                    name="keywords"
                    content="Riyora Organic, Return Policy, Refund Policy, Cancellation Policy, Exchange Policy, Customer Satisfaction, Indian E-commerce"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://riyoraorganic.com/return-refund-policy" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Return, Refund, Cancellation & Exchange Policy | Riyora Organic" />
                <meta
                    property="og:description"
                    content="Understand Riyora Organic's transparent and customer-friendly return, refund, cancellation, and exchange policy. Hassle-free process and clear timelines."
                />
                <meta property="og:url" content="https://riyoraorganic.com/return-refund-policy" />
                <meta property="og:image" content="https://riyoraorganic.com/images/refund-og.jpg" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Return, Refund, Cancellation & Exchange Policy | Riyora Organic" />
                <meta
                    name="twitter:description"
                    content="Check Riyora Organic's policy for returns, refunds, cancellations, and exchanges. Customer-first approach with clear timelines and eligibility criteria."
                />
                <meta name="twitter:image" content="https://riyoraorganic.com/images/refund-og.jpg" />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Return, Refund, Cancellation & Exchange Policy",
                            "url": "https://riyoraorganic.com/return-refund-policy",
                            "description": "Riyora Organic Return, Refund, Cancellation, and Exchange Policy. Easy return and refund process, clear timelines, and customer-friendly service.",
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
                        <h1 className={styles.title}>Return, Refund, Cancellation, and Exchange Policy</h1>
                        <p className={styles.date}>Effective Date: 12th October 2025</p>
                        <p className={styles.intro}>
                            At Riyora Organic, we strive to deliver the highest quality products and ensure
                            complete customer satisfaction. This page outlines our clear and customer-friendly
                            return, refund, cancellation, and exchange policy.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <section>
                        <h2>Returns, Refunds, Cancellations, and Exchanges</h2>
                        <h3>What We’ll Do Together</h3>
                        <p><strong>Step 1:</strong></p>
                        <ul>
                            <li>Raise a return or replacement request within 7 days for incorrect or expired products.</li>
                            <li>Email <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> with your order details.</li>
                            <li>Contact our customer support chat if needed.</li>
                            <li>Report damaged or missing products within 2 days of delivery.</li>
                        </ul>
                        <p><strong>Step 2:</strong> Our team reviews the request within 2 working days.</p>
                        <p><strong>Step 3:</strong> Approved requests trigger reverse pickup via our courier partner.</p>
                        <p><strong>Step 4:</strong> If reverse pickup isn't available, self-ship with reimbursed courier charges.</p>
                        <p><strong>Step 5:</strong> Verification upon receipt, followed by refund or replacement.</p>
                    </section>

                    <section>
                        <h2>Eligible Conditions for Return/Replacement</h2>
                        <ul>
                            <li>Incorrect product delivered</li>
                            <li>Expired product received</li>
                            <li>Damaged product or tampered packaging</li>
                            <li>Incomplete order (missing products)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Return/Replacement Requests Not Accepted</h2>
                        <ul>
                            <li>Opened, used, or altered products</li>
                            <li>Missing original packaging</li>
                            <li>Requests after 7 days of delivery</li>
                            <li>Damaged/missing products reported after 2 days</li>
                        </ul>
                    </section>

                    <section>
                        <h2>How Returns Are Processed</h2>
                        <p>Once approved, our courier picks up the product in 5–7 business days. Refund or replacement is initiated after quality inspection.</p>
                    </section>

                    <section>
                        <h2>Order Cancellation Policy</h2>
                        <ul>
                            <li>Cancel orders before “Ready to Ship” status via your account.</li>
                            <li>Riyora Organic may cancel orders without notice, contacting you for verification if needed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Refund Policy</h2>
                        <h3>How Will I Receive My Refund?</h3>
                        <ul>
                            <li>Prepaid Orders: Refunds credited to original payment method within 7 business days.</li>
                            <li>Cash on Delivery Orders: Refunds via bank transfer after providing bank details.</li>
                        </ul>
                        <h3>Refund Timelines</h3>
                        <ul>
                            <li>Cancelled orders: 7 business days.</li>
                            <li>Returned products: 14 business days post-quality check.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Partial Returns</h2>
                        <p>Individual items can be returned if they meet eligibility criteria within 7 days of delivery.</p>
                    </section>

                    <section>
                        <h2>Need Help?</h2>
                        <p>Contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> for assistance. We are committed to your satisfaction and a seamless shopping experience.</p>
                    </section>
                </article>
            </main>
        </>
    );
}
