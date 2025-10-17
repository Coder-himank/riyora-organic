import React from "react";
import styles from "@/styles/refund-policy.module.css";

export default function ReturnRefundPolicy() {
    return (
        <main className={styles.container}>
            <article className={styles.article}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Return, Refund, Cancellation, and Exchange Policy</h1>
                    <p className={styles.date}>Effective Date: 12th October 2025</p>
                    <p className={styles.intro}>
                        At Riyora Organic, we strive to deliver the highest quality products and ensure
                        complete customer satisfaction. However, if you are not entirely satisfied with
                        your purchase, we offer a simple and transparent return and refund policy as
                        outlined below.
                    </p>
                </div>

                <section>
                    <h2>Returns, Refunds, Cancellations, and Exchanges</h2>
                    <h3>What We’ll Do Together</h3>
                    <p><strong>Step 1:</strong></p>
                    <ul>
                        <li>
                            Raise a return or replacement request within 7 days from the date of delivery if
                            you have received an incorrect or expired product.
                        </li>
                        <li>Please email us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> with your order details and contact information.</li>
                        <li>You can also reach out to us via our customer support chat.</li>
                        <li>In case of a damaged or missing product, please raise a request within 2 days of delivery.</li>
                    </ul>

                    <p><strong>Step 2:</strong> Our team will review your return request within 2 working days.</p>
                    <p><strong>Step 3:</strong> If your return request is approved, we will arrange a reverse pickup through our courier partner.</p>
                    <p><strong>Step 4:</strong> If reverse pickup is not available at your location, you may be asked to self-ship the product via a reliable courier. Courier charges will be reimbursed to you via your preferred payment method (UPI, PayTM, or NEFT).</p>
                    <p><strong>Step 5:</strong> Once the returned product is received, our team will verify it against your claim and initiate a replacement or refund, depending on stock availability.</p>
                </section>

                <section>
                    <h2>Eligible Conditions for Return/Replacement</h2>
                    <ul>
                        <li>The wrong product was delivered</li>
                        <li>You received an expired product</li>
                        <li>The product was damaged (physical damage or tampered packaging)</li>
                        <li>Your order was incomplete (missing products)</li>
                    </ul>
                </section>

                <section>
                    <h2>Return/Replacement Requests Will Not Be Accepted If:</h2>
                    <ul>
                        <li>The product has been opened, used, or altered</li>
                        <li>The original packaging (cartons, labels, etc.) is missing</li>
                        <li>The return/replacement request is raised after 7 days from delivery</li>
                        <li>Damaged or missing products are reported after 2 days from delivery</li>
                    </ul>
                </section>

                <section>
                    <h2>How Returns Are Processed</h2>
                    <p>
                        Once a return request is approved, our courier partner will pick up the product
                        within 5–7 business days. After inspection by our quality control team, a refund or
                        replacement will be initiated as per the findings.
                    </p>
                </section>

                <section>
                    <h2>Order Cancellation Policy</h2>
                    <ul>
                        <li>You can cancel your order before it reaches the “Ready to Ship” status by logging into your account and selecting the CANCEL option in the order details.</li>
                        <li>Riyora Organic reserves the right to cancel any order at any time without prior notice. In certain cases, we may contact you for verification before dispatching the order.</li>
                    </ul>
                </section>

                <section>
                    <h2>Refund Policy</h2>
                    <h3>How Will I Receive My Refund?</h3>
                    <ul>
                        <li>Prepaid Orders: Refunds will be credited to the original payment method (bank account, credit/debit card, or UPI) within 7 business days.</li>
                        <li>Cash on Delivery (COD) Orders: Refunds will be processed via bank transfer after you share your bank details with us.</li>
                    </ul>

                    <h3>Refund Timelines</h3>
                    <ul>
                        <li>Refunds for canceled orders are processed within 7 business days.</li>
                        <li>Refunds for returned products are processed within 14 business days after the product passes our quality check.</li>
                    </ul>
                </section>

                <section>
                    <h2>Partial Returns</h2>
                    <p>
                        Yes, you can return individual items from your order if they meet the return
                        eligibility criteria within 7 days of delivery.
                    </p>
                </section>

                <section>
                    <h2>Need Help?</h2>
                    <p>
                        For any questions, feel free to contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>.
                        We value your trust and are committed to providing you with the best possible experience at Riyora Organic.
                    </p>
                </section>
            </article>
        </main>
    );
}