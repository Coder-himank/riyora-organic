import styles from '@/styles/services.module.css';
import Head from 'next/head';
import Image from 'next/image';

const Services = () => {
    return (
        <>
            <Head>
                {/* Primary SEO Tags */}
                <title>Riyora Organic Hair Oil & Wellness Services | Premium Organic Care</title>
                <meta
                    name="description"
                    content="Discover Riyora Organic's premium hair oil and holistic wellness services. Shop certified organic hair care, enjoy fast delivery, sustainable packaging, subscription boxes, gifting options, and expert support."
                />
                <meta
                    name="keywords"
                    content="Riyora Organic, organic hair oil, hair care, natural hair products, wellness, sustainable living, eco-friendly, subscription box, gifting, customer support, organic produce, healthy lifestyle"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://riyoraorganic.com/services" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Riyora Organic Hair Oil & Wellness Services | Premium Organic Care" />
                <meta property="og:description" content="Explore Riyora Organic's hair oil and wellness services, including fast delivery, subscription boxes, sustainable packaging, and expert support for a healthier lifestyle." />
                <meta property="og:image" content="https://riyoraorganic.com/images/riyora-hair-oil-banner.jpg" />
                <meta property="og:url" content="https://riyoraorganic.com/services" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Riyora Organic Hair Oil & Wellness Services | Premium Organic Care" />
                <meta name="twitter:description" content="Shop Riyora Organic's hair oil and wellness services. Enjoy organic hair care, eco-friendly packaging, subscription options, and expert guidance." />
                <meta name="twitter:image" content="https://riyoraorganic.com/images/riyora-hair-oil-banner.jpg" />

                {/* Structured Data: WebPage */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Riyora Organic Hair Oil & Wellness Services",
                            "description": "Riyora Organic offers premium organic hair oil and wellness services, including online shopping, subscription boxes, gifting, and eco-friendly delivery.",
                            "url": "https://riyoraorganic.com/services",
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

            <div className={styles.banner}></div>
            <div className={styles.service_container}>
                <div className={styles.hero}>
                    <Image
                        src="/images/riyora-hair-oil-banner.jpg"
                        alt="Riyora Organic Hair Oil - Nourish Your Hair Naturally"
                        width={1200}
                        height={400}
                        priority
                        style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                    />
                </div>

                <section className={styles.intro}>
                    <h1>Riyora Organic Hair Oil & Wellness Services</h1>
                    <p>
                        Welcome to Riyora Organic, your trusted destination for premium organic hair oil and holistic wellness. Our signature hair oil is crafted with pure, natural ingredients to nourish, strengthen, and revitalize your hair. Explore our full suite of organic services designed for a healthier, sustainable lifestyle.
                    </p>
                </section>

                {/* Updated heading hierarchy for SEO */}
                <h2>Our Services</h2>
                <p>
                    At Organic Robust, we are committed to making healthy living easy, accessible, and enjoyable. Our range of services ensures a seamless shopping experience for those who value quality, sustainability, and wellness.
                </p>

                {/* Service Sections */}
                <section className={styles.service_section}>
                    <h3>1. Online Shopping</h3>
                    <p>Shop from home with our user-friendly online store. Browse certified organic groceries, pantry staples, fresh produce, personal care products, and eco-friendly household items.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>2. Fast & Reliable Delivery</h3>
                    <p>Receive your organic essentials directly at your doorstep—fast, fresh, and hassle-free. Track your order in real-time with same-day or next-day delivery options in select areas.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>3. Subscription Boxes</h3>
                    <p>Stay stocked with customizable subscription boxes. Get your favorite organic products delivered weekly, bi-weekly, or monthly according to your preference.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>4. Fresh Produce Delivery</h3>
                    <p>Enjoy farm-fresh seasonal fruits and vegetables. We collaborate directly with local organic farmers to deliver the best quality produce to your table.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>5. Natural Health & Beauty Products</h3>
                    <p>Explore a curated range of clean, cruelty-free, and organic skincare, haircare, and wellness products sourced from trusted brands.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>6. Gifting Services</h3>
                    <p>Celebrate sustainably with our eco-friendly gift hampers. Ideal for birthdays, holidays, and special occasions with handpicked organic goodies.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>7. Customer Support</h3>
                    <p>Need help placing an order or choosing the right product? Our friendly team is available via phone, chat, or email to assist you.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>8. Sustainable Packaging</h3>
                    <p>We use recyclable, biodegradable, or reusable packaging for all orders, minimizing unnecessary plastic use.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>9. Wellness Blog & Recipes</h3>
                    <p>Get inspired with holistic wellness tips, organic recipes, and health insights curated by our nutrition experts and chefs.</p>
                </section>

                <section className={styles.service_section}>
                    <h3>10. Click & Collect</h3>
                    <p>Prefer to pick up your order? Use our Click & Collect service to shop online and collect at our store conveniently.</p>
                </section>
            </div>
        </>
    );
};

export default Services;
