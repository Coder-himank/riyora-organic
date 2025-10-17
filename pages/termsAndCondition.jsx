import React from "react";
import styles from "@/styles/termsAndCondition.module.css";

export default function TermsOfService() {
return (
        <main className={styles.container}>
            <article className={styles.article}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Terms of Service</h1>
                    <p className={styles.date}>Effective Date: 16th October 2025</p>
                    <p className={styles.intro}>
                        Welcome to Riyora Organic. By placing an order on our website, you agree to the terms and
                        conditions mentioned below. Please read them carefully before making a purchase.
                    </p>
                </div>

                <section>
                    <h2>1. Order Processing</h2>
                    <p>Once your order is placed, it is automatically processed by our system.</p>
                </section>

                <section>
                    <h2>2. Payment Confirmation</h2>
                    <p>It may take up to 48 hours to confirm your payment with the bank.</p>
                </section>

                <section>
                    <h2>3. Shipping and Dispatch</h2>
                    <p>
                        After payment confirmation, your order will be packed and shipped. You will receive a shipping
                        confirmation email with tracking details on your registered email address once your order is dispatched.
                    </p>
                </section>

                <section>
                    <h2>4. Delivery and Tracking</h2>
                    <p>
                        You can track your order through the tracking link provided in the email or SMS sent to your registered
                        contact details.
                    </p>
                </section>

                <section>
                    <h2>5. Damaged or Broken Products</h2>
                    <p>
                        Complaints for replacement of damaged, broken, or defective products will be accepted only within 48
                        hours of delivery. Please share relevant photos or unboxing videos (if available) for verification.
                    </p>
                </section>

                <section>
                    <h2>6. Customer Support</h2>
                    <p>
                        For any queries, concerns, or details related to your order, please contact us at
                        <a href="mailto:care@riyoraorganic.com"> care@riyoraorganic.com</a>.
                    </p>
                </section>

                <section>
                    <h2>7. Promotional Communication</h2>
                    <p>
                        Riyora Organic may send you emails, SMS, WhatsApp, or RCS messages from time to time regarding new
                        products, offers, and promotional programs.
                    </p>
                    <p>
                        If you wish to opt out of receiving such communications, please email us at
                        <a href="mailto:care@riyoraorganic.com"> care@riyoraorganic.com</a> with the subject line “Unsubscribe.”
                    </p>
                </section>

                <section>
                    <p>
                        By continuing to browse and use our website, you agree to be bound by these Terms of Service and other
                        policies listed on our website.
                    </p>
                </section>

                <footer className={styles.footer}>
                    <p>
                        We thank you for choosing Riyora Organic and look forward to serving you with nature-inspired care.
                    </p>
                </footer>
            </article>
        </main>
    );
}
