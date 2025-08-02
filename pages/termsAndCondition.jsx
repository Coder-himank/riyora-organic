import React from "react";
import styles from "@/styles/termsAndCondition.module.css"
const TermsAndCondition = () => (
    <div className={styles.container}>
        <div className={styles.header}>
            <h1>Welcome to Riyora Organic</h1>
        </div>
        <div className={styles.sub_header}>

            <h2>Terms and Conditions</h2>
            <p>
                These terms and conditions outline the rules and regulations for the use of ShineHair Oil's Website, located at www.shinehairoil.com.
            </p>
        </div>
        <div className={styles.terms}>

            <section>
                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use ShineHair Oil if you do not agree to all of the terms and conditions stated on this page.
                </p>
            </section>
            <section>

                <h3>2. Intellectual Property Rights</h3>
                <p>
                    Unless otherwise stated, ShineHair Oil and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
                </p>
            </section>
            <section>
                <h3>3. Use of Website</h3>
                <ul>
                    <li>You must not republish material from this website.</li>
                    <li>You must not sell, rent, or sub-license material from this website.</li>
                    <li>You must not reproduce, duplicate, or copy material from this website.</li>
                </ul>
            </section>
            <section>
                <h3>4. Product Information</h3>
                <p>
                    All information provided about our hair oil products is for general informational purposes only. Results may vary from person to person.
                </p>
            </section>
            <section>
                <h3>5. Limitation of Liability</h3>
                <p>
                    ShineHair Oil will not be liable for any damages arising from the use or inability to use the materials on this website or the performance of the products.
                </p>
            </section>
            <section>
                <h3>6. Changes to Terms</h3>
                <p>
                    We reserve the right to revise these terms and conditions at any time. By using this website, you are expected to review these terms regularly.
                </p>
            </section>
            <section>
                <h3>7. Contact Us</h3>
                <p>
                    If you have any questions about these Terms and Conditions, please contact us at support@shinehairoil.com.
                </p>
            </section>
        </div>
    </div>
);

export default TermsAndCondition;