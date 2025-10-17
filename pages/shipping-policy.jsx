import React from "react";
import styles from "@/styles/shiping-policy.module.css";

export default function ShippingPolicy() {
    return (
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
                        <li><strong>Delivery Time:</strong> Orders are typically delivered within 7–15 business days from the date of dispatch. Delivery times may vary depending on your location and other unforeseen circumstances.</li>
                        <li><strong>Order Processing:</strong> Orders are processed and dispatched within 2–3 business days of order placement, subject to stock availability.</li>
                        <li><strong>Courier Partners:</strong> We work with reliable logistics partners to ensure safe and timely delivery of your products.</li>
                    </ul>
                </section>

                <section>
                    <h2>International Shipping</h2>
                    <ul>
                        <li><strong>Shipping Charges:</strong> International shipping is chargeable and varies based on the destination country. The exact shipping charges will be calculated at checkout.</li>
                        <li><strong>Delivery Time:</strong> International orders may take up to 30 days for delivery, depending on the destination and customs clearance process.</li>
                        <li><strong>Custom Duties & Taxes:</strong> Customs duties, import taxes, and any additional fees imposed by the destination country are not included in the shipping charges. These charges must be paid directly by the customer to the courier company at the time of delivery.</li>
                        <li><strong>Non-Delivery Assistance:</strong> If your order has not been delivered within the estimated timeframe, please contact us at <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a> for assistance.</li>
                    </ul>
                </section>

                <section>
                    <h2>Order Tracking</h2>
                    <ul>
                        <li>Once your order is shipped, a tracking link will be shared with you via email or SMS so you can monitor the shipment’s progress.</li>
                        <li>If you do not receive your tracking details within 3 days of placing the order, please contact our customer support team.</li>
                    </ul>
                </section>

                <section>
                    <h2>Important Information</h2>
                    <ul>
                        <li>If your delivery status shows “Delivered” but you have not received the package, please notify us within 24 hours of the status update. After 48 hours, courier companies may not accept Proof of Delivery (POD) disputes.</li>
                        <li>Riyora Organic will not be responsible for delays caused due to natural calamities, strikes, lockdowns, or other unforeseen events beyond our control.</li>
                        <li>If a shipment is returned due to an incorrect address, refusal to accept, or multiple failed delivery attempts, the reshipping cost will be borne by the customer.</li>
                        <li>In case of a refund request for returned shipments, the original shipping charges will be deducted from the total refund amount before processing.</li>
                    </ul>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>
                        For any queries or concerns regarding shipping, please reach out to us at
                        <a href="mailto:care@riyoraorganic.com"> care@riyoraorganic.com</a>.
                    </p>
                    <p>
                        We appreciate your trust in Riyora Organic and look forward to serving you with care and dedication.
                    </p>
                </section>
            </article>
        </main>
    );
}
