import styles from '@/styles/services.module.css';

const Services = () => {
    return (
        <>
            {/* <div className="navHolder"></div> */}
            <div className={styles.banner}></div>
            <div className={styles.service_container}>

                <h1>Our Services</h1>
                <p>At Organic Robust, we're committed to making healthy living easy, accessible, and enjoyable. Our range of services is designed to provide a seamless and enriching shopping experience for those who value quality, sustainability, and wellness.</p>
                <section className={styles.service_section}>
                    <h2>1. Online Shopping</h2>
                    <p>
                        Shop from the comfort of your home with our user-friendly online store. Browse through a wide selection of certified organic groceries, pantry staples, fresh produce, personal care products, and eco-friendly household items.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>2. Fast & Reliable Delivery</h2>
                    <p>
                        We deliver your organic essentials straight to your doorstep—fresh, fast, and hassle-free. Enjoy same-day or next-day delivery options in select areas, and track your order in real-time.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>3. Subscription Boxes</h2>
                    <p>
                        Stay stocked up with our customizable subscription boxes. Choose your favorite organic products and get them delivered on a schedule that suits you—weekly, bi-weekly, or monthly.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>4. Fresh Produce Delivery</h2>
                    <p>
                        Get farm-fresh, seasonal fruits and vegetables delivered regularly. We work directly with local organic farmers to bring you the best from the field to your table.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>5. Natural Health & Beauty Products</h2>
                    <p>
                        Explore a curated range of clean, cruelty-free, and organic skincare, haircare, and wellness products. We only partner with trusted brands that share our values.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>6. Gifting Services</h2>
                    <p>
                        Celebrate sustainably with our eco-friendly gift hampers. Perfect for birthdays, holidays, and special occasions, our gifts are packed with love and handpicked organic goodies.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>7. Customer Support</h2>
                    <p>
                        Need help placing an order or finding the right product? Our friendly customer service team is always ready to assist via phone, chat, or email.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>8. Sustainable Packaging</h2>
                    <p>
                        We care about the planet. All our orders are packed using recyclable, biodegradable, or reusable materials—no unnecessary plastics.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>9. Wellness Blog & Recipes</h2>
                    <p>
                        Get inspired with healthy tips, holistic wellness articles, and easy-to-follow organic recipes created by our nutrition experts and chefs.
                    </p>
                </section>

                <section className={styles.service_section}>
                    <h2>10. Click & Collect</h2>
                    <p>
                        Prefer to pick up your order? Use our Click & Collect service to shop online and collect from our store at your convenience.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Services;
