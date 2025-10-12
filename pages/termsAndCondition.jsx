import React from "react";
import Head from "next/head";
import styles from "@/styles/termsAndCondition.module.css";

export default function TermsAndConditions() {
    return (
        <>
            <Head>
                <title>Terms & Conditions | Riyora Organic</title>
                <meta
                    name="description"
                    content="Terms and Conditions for Riyora Organic — please read our policies regarding purchases, shipping, and product use."
                />
            </Head>

            <main className={styles.container}>
                <h1 className={styles.title}>Terms & Conditions</h1>
                <p className={styles.updated}>
                    Last updated: {new Date().toLocaleDateString("en-IN")}
                </p>

                <section className={styles.section}>
                    <p>
                        Welcome to <strong>Riyora Organic</strong>. By accessing or using our
                        website (<a href="https://riyoraorganic.com">riyoraorganic.com</a>)
                        and purchasing our products, you agree to comply with and be bound
                        by the following Terms and Conditions. Please read them carefully
                        before making any purchase.
                    </p>

                    <h2>1. General Information</h2>
                    <p>
                        Riyora Organic (“we”, “our”, “us”) operates as an e-commerce brand
                        offering natural hair oils and related personal-care products. All
                        products are manufactured and sold in India.
                    </p>

                    <h2>2. Product Use & Disclaimer</h2>
                    <p>
                        Our products are made from natural ingredients and are intended for{" "}
                        <strong>external use only</strong>. While we aim to use safe and
                        effective ingredients, individual results may vary depending on hair
                        type, skin sensitivity, or other factors.
                    </p>
                    <p>
                        <strong>Medical Disclaimer:</strong> Our products are not intended
                        to diagnose, treat, cure, or prevent any disease or medical
                        condition. Please consult a qualified healthcare professional before
                        use if you have allergies, sensitive skin, or any medical
                        conditions.
                    </p>

                    <h2>3. Orders & Payments</h2>
                    <ul>
                        <li>All prices are displayed in Indian Rupees (INR).</li>
                        <li>
                            We currently accept <strong>online payments only</strong> via
                            secure payment gateways. We do not offer Cash on Delivery (COD).
                        </li>
                        <li>
                            Orders are processed only after successful payment confirmation.
                        </li>
                    </ul>

                    <h2>4. Shipping Policy</h2>
                    <p>
                        We offer <strong>Pan India delivery</strong> through third-party
                        courier partners. Shipping timelines may vary based on location and
                        logistics but typically take up to <strong>15 days</strong> from the
                        date of dispatch.
                    </p>
                    <p>
                        Please ensure that your delivery address and contact details are
                        accurate while placing your order. We are not responsible for delays
                        or failed deliveries caused by incorrect information or courier
                        issues.
                    </p>

                    <h2>5. Return & Replacement Policy</h2>
                    <p>
                        Due to the personal nature of our products, we do not accept returns
                        or exchanges once the order has been delivered.
                    </p>
                    <p>
                        However, in the unlikely event that you receive a{" "}
                        <strong>damaged or tampered package</strong>, you may request a
                        replacement within <strong>2 working days</strong> of delivery by
                        providing valid photographic or video proof of the damage.
                    </p>
                    <p>
                        Replacements are subject to verification and approval by our
                        support team. No refunds will be issued under any circumstances.
                    </p>

                    <h2>6. Intellectual Property</h2>
                    <p>
                        All content on this website, including logos, product images, text,
                        graphics, and designs, is the intellectual property of Riyora
                        Organic and is protected under applicable copyright and trademark
                        laws. Unauthorized use, reproduction, or distribution of any
                        material is strictly prohibited.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        Riyora Organic shall not be held liable for any indirect,
                        incidental, or consequential damages arising from the use or misuse
                        of our products or website. Product suitability is the customer’s
                        responsibility.
                    </p>

                    <h2>8. Third-Party Links</h2>
                    <p>
                        Our website may contain links to third-party sites. We are not
                        responsible for the content, policies, or practices of those
                        websites.
                    </p>

                    <h2>9. Governing Law</h2>
                    <p>
                        These Terms & Conditions are governed by and construed in accordance
                        with the laws of India. Any disputes shall be subject to the
                        exclusive jurisdiction of the courts of{" "}
                        <strong>Udaipur, Rajasthan, India</strong>.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        For questions, concerns, or support, please contact us at:
                    </p>

                    <div className={styles.contactBox}>
                        <p>
                            <strong>Riyora Organic</strong>
                        </p>
                        <p>
                            LG 61, Manglam Fun Square Mall, Durga Nursery Rd, Udaipur,
                            Rajasthan – 313001, India
                        </p>
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

                    <p className={styles.footerNote}>
                        By purchasing from Riyora Organic, you acknowledge that you have
                        read, understood, and agreed to these Terms and Conditions.
                    </p>
                </section>
            </main>
        </>
    );
}
