import React from "react";
import styles from "@/styles/visionAndMission.module.css";
import Image from "next/image";
import Head from "next/head";

const VisionAndMission = () => {
    return (
        <>
            <Head>
                {/* Primary SEO */}
                <title>Riyora Organic | Ayurvedic Hair Oil - Vision & Mission</title>
                <meta
                    name="description"
                    content="Discover Riyora Organic's vision and mission for natural, Ayurvedic hair oil. Learn how we blend ancient wisdom and modern science for healthy, beautiful hair."
                />
                <meta
                    name="keywords"
                    content="Riyora Organic, Ayurvedic hair oil, natural hair care, herbal hair oil, vision, mission, natural beauty, chemical-free, hair growth, scalp health"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://riyoraorganic.com/vision-and-mission" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Riyora Organic | Ayurvedic Hair Oil - Vision & Mission" />
                <meta
                    property="og:description"
                    content="Riyora Organic is dedicated to providing pure, herbal hair oil inspired by Ayurveda and modern science. Explore our vision and mission for holistic hair wellness."
                />
                <meta property="og:image" content="https://riyoraorganic.com/images/logo.png" />
                <meta property="og:url" content="https://riyoraorganic.com/vision-and-mission" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Riyora Organic | Ayurvedic Hair Oil - Vision & Mission" />
                <meta
                    name="twitter:description"
                    content="Learn about Riyora Organic's vision and mission for natural hair care, blending Ayurvedic wisdom and modern science."
                />
                <meta name="twitter:image" content="https://riyoraorganic.com/images/logo.png" />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "AboutPage",
                            "name": "Riyora Organic Vision & Mission",
                            "url": "https://riyoraorganic.com/vision-and-mission",
                            "description": "Riyora Organic's vision and mission for natural Ayurvedic hair oil, blending ancient wisdom with modern science for healthy, beautiful hair.",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Riyora Organic",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://riyoraorganic.com/images/logo.png"
                                }
                            }
                        })
                    }}
                />
            </Head>

            <main className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.mainTitle}>Our Vision &amp; Mission</h1>
                    <p className={styles.subtitle}>
                        Discover the purpose and passion behind Riyora Organic’s Ayurvedic hair oil journey.
                    </p>
                </div>

                <section className={styles.visionSection}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/images/logo.png"
                            alt="Riyora Organic Ayurvedic Hair Oil Logo"
                            className={styles.image}
                            width={600}
                            height={600}
                            priority
                        />
                    </div>
                    <div className={styles.textContent}>
                        <h2 className={styles.sectionTitle}>Our Vision</h2>
                        <p className={styles.sectionText}>
                            At Riyora Organic, our vision is to revolutionize hair care by making pure, Ayurvedic hair oil accessible to everyone. We aspire to restore trust in natural, plant-powered solutions, empowering individuals to embrace healthy, beautiful hair without harsh chemicals or false promises.
                        </p>
                        <p>
                            We envision a world where daily hair care is rooted in ancient Ayurvedic wisdom and enhanced by modern scientific research. Riyora Organic is committed to delivering clean, herbal hair oil that nurtures scalp health, promotes hair growth, and celebrates the beauty of nature.
                        </p>
                    </div>
                </section>

                <section className={styles.missionSection}>
                    <div className={styles.textContent}>
                        <h2 className={styles.sectionTitle}>Our Mission</h2>
                        <p className={styles.sectionText}>
                            Our mission is to craft high-quality, natural hair oil using time-tested Ayurvedic herbs and modern botanical science. We strive to provide effective, honest, and safe hair care solutions that support holistic wellness and sustainable beauty.
                        </p>
                        <p>
                            Every bottle of Riyora Organic Hair Oil is a blend of tradition and innovation—free from toxic chemicals, parabens, and artificial fragrances. We are dedicated to educating our community about the benefits of natural hair care and inspiring confidence through visible, healthy results.
                        </p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/images/logo.png"
                            alt="Riyora Organic Hair Oil Mission"
                            className={styles.image}
                            width={600}
                            height={600}
                        />
                    </div>
                </section>

                <section className={styles.valuesSection}>
                    <h2 className={styles.sectionTitle}>Our Core Values</h2>
                    <ul className={styles.valuesList}>
                        <li className={styles.valueItem}>
                            <strong>Purity:</strong> We use only natural ingredients, ensuring every drop of our hair oil is safe and effective.
                        </li>
                        <li className={styles.valueItem}>
                            <strong>Integrity:</strong> Transparency and honesty guide every step, from sourcing herbs to delivering results.
                        </li>
                        <li className={styles.valueItem}>
                            <strong>Innovation:</strong> We blend ancient Ayurvedic wisdom with modern research for advanced hair care solutions.
                        </li>
                        <li className={styles.valueItem}>
                            <strong>Sustainability:</strong> Our commitment to eco-friendly practices protects both your hair and the planet.
                        </li>
                        <li className={styles.valueItem}>
                            <strong>Customer Focus:</strong> Your hair wellness is our priority—every formula is designed for real, lasting benefits.
                        </li>
                    </ul>
                </section>

                <footer>
                    <p>
                        Explore our <a href="/services">Services</a> and <a href="/products">Products</a> to see how Riyora Organic brings our mission to life.
                    </p>
                </footer>
            </main>
        </>
    );
};

export default VisionAndMission;
