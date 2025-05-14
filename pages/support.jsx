import React from 'react';
import styles from "@/styles/support.module.css";
const Support = () => {
    return (
        <>
            <div className={styles.banner}></div>
            <div className={styles.support_container}>
                <h1>Support</h1>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus quod voluptate magni? Obcaecati hic ratione quasi exercitationem. Nostrum, odio labore modi ab saepe suscipit illo consequuntur incidunt temporibus adipisci impedit.</p>

                <section className={styles.support_section}>
                    <h2>Customer Care</h2>
                    <p>
                        Our customer care team is here to assist you with any questions or concerns.
                        You can reach us via email at support@example.com or call us at (123) 456-7890.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Return Policy</h2>
                    <p>
                        We offer a 30-day return policy for all items. To initiate a return, please visit
                        our <a href="/returns" style={{ color: 'blue', textDecoration: 'underline' }}>Returns Page</a>
                        or contact our support team.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Privacy Policy</h2>
                    <p>
                        Your privacy is important to us. Please review our
                        <a href="/privacy-policy" style={{ color: 'blue', textDecoration: 'underline' }}> Privacy Policy</a>
                        to understand how we handle your data.
                    </p>
                </section>

                <section className={styles.support_section}>
                    <h2>Help</h2>
                    <p>
                        Need help? Visit our <a href="/faq" style={{ color: 'blue', textDecoration: 'underline' }}>FAQ Page</a>
                        for answers to common questions or contact our support team for further assistance.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Support;