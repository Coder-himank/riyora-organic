import React from "react";
import styles from "@/styles/termsAndCondition.module.css";

const TermsAndCondition = () => (
    <div className={styles.container}>
        <div className={styles.header}>
            <h1>Welcome to Riyora Organic</h1>
        </div>

        <div className={styles.sub_header}>
            <h2>Terms and Conditions</h2>
            <p>
                These terms and conditions outline the rules and regulations for the use of Riyora Organic’s website, located at{" "}
                <a href="https://www.riyoraorganic.com" target="_blank" rel="noopener noreferrer">
                    www.riyoraorganic.com
                </a>.
            </p>
        </div>

        <div className={styles.terms}>
            <section>
                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing this website, you agree to be bound by these terms and conditions. If you do not agree to all of the terms stated on this page, please do not continue to use Riyora Organic.
                </p>
            </section>

            <section>
                <h3>2. Intellectual Property Rights</h3>
                <p>
                    Unless otherwise stated, Riyora Organic and/or its licensors own the intellectual property rights for all material on this website, including logos, product images, and written content. All rights are reserved.
                </p>
            </section>

            <section>
                <h3>3. Use of Website</h3>
                <ul>
                    <li>You must not republish material from this website without prior written consent.</li>
                    <li>You must not sell, rent, or sub-license material from this website.</li>
                    <li>You must not reproduce, duplicate, or copy material from this website.</li>
                    <li>Content must not be used for any unlawful or harmful purpose.</li>
                </ul>
            </section>

            <section>
                <h3>4. Product Information</h3>
                <p>
                    All information provided about Riyora Organic products is for general informational purposes only. Our products are made from natural ingredients, and results may vary from person to person.
                </p>
            </section>

            <section>
                <h3>5. Limitation of Liability</h3>
                <p>
                    Riyora Organic will not be held liable for any damages arising from the use or inability to use our website, products, or materials. Users are responsible for ensuring the suitability of products for their individual needs.
                </p>
            </section>

            <section>
                <h3>6. Changes to Terms</h3>
                <p>
                    Riyora Organic reserves the right to update or modify these terms and conditions at any time without prior notice. Continued use of this website following changes implies acceptance of the revised terms.
                </p>
            </section>

            <section>
                <h3>7. Governing Law</h3>
                <p>
                    These terms shall be governed by and interpreted in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in [your city/state, e.g., Mumbai, Maharashtra].
                </p>
            </section>

            <section>
                <h3>8. Contact Us</h3>
                <p>
                    If you have any questions about these Terms and Conditions, please contact us at{" "}
                    <a href="mailto:care@riyoraorganic.com">care@riyoraorganic.com</a>.
                </p>
            </section>
        </div>
    </div>
);

export default TermsAndCondition;
