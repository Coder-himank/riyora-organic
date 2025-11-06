import Head from "next/head";
import styles from "@/styles/customerCare.module.css";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CustomerCare() {
    // Structured Data for ContactPage
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Customer Care | Riyora Organic",
        "description": "Get in touch with Riyora Organic customer care via email, phone, or visit our head office in Udaipur, Rajasthan.",
        "url": "https://riyoraorganic.com/customer-care",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "email": "care@riyoraorganic.com",
                "contactType": "customer support",
                "availableLanguage": "English",
                "areaServed": "IN"
            },
            {
                "@type": "ContactPoint",
                "telephone": "+919680886889",
                "contactType": "customer support",
                "availableLanguage": "English",
                "areaServed": "IN"
            }
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "61 LG, Manglam Fun Square Mall, Durga Nursery Rd, Shakti Nagar",
            "addressLocality": "Udaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "313001",
            "addressCountry": "IN"
        }
    };

    return (
        <>
            <Head>
                {/* Primary SEO Meta */}
                <title>Customer Care | Riyora Organic</title>
                <meta
                    name="description"
                    content="Contact Riyora Organic customer care for any queries. Reach us via email, phone, or visit our office in Udaipur, Rajasthan."
                />
                <meta
                    name="keywords"
                    content="Riyora Organic, customer care, contact, email, phone, office, Udaipur, Rajasthan, Ayurvedic hair oil, natural hair care"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://riyoraorganic.com/customer-care" />

                {/* Open Graph for social sharing */}
                <meta property="og:title" content="Customer Care | Riyora Organic" />
                <meta property="og:description" content="Get in touch with Riyora Organic customer support via email, phone, or visit our office in Udaipur, Rajasthan." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://riyoraorganic.com/customer-care" />
                <meta property="og:image" content="https://riyoraorganic.com/images/customer-care.jpg" />
                <meta property="og:site_name" content="Riyora Organic" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Customer Care | Riyora Organic" />
                <meta name="twitter:description" content="Reach Riyora Organic customer care via email, phone, or visit our office in Udaipur, Rajasthan." />
                <meta name="twitter:image" content="https://riyoraorganic.com/images/customer-care.jpg" />
                <meta name="twitter:site" content="@riyora_organic" />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <main className={styles.container}>
                {/* Header Section */}
                <div className={styles.careheader}>
                    <h1>Customer Care</h1>
                    <p>
                        We’re here to help you with any queries about <strong>Riyora Organic</strong>. Contact us using the options below for fast and reliable support.
                    </p>
                </div>

                {/* Contact Cards */}
                <section className={styles.cards} aria-label="Customer Care Contact Methods">
                    {/* Email Card */}
                    <article className={styles.card}>
                        <Mail className={styles.icon} aria-hidden="true" />
                        <h2>Email Us</h2>
                        <p>Send your queries or feedback anytime, and we’ll respond promptly.</p>
                        <a href="mailto:care@riyoraorganic.com" aria-label="Email Riyora Organic Customer Care">
                            care@riyoraorganic.com
                        </a>
                    </article>

                    {/* Phone Card */}
                    <article className={styles.card}>
                        <Phone className={styles.icon} aria-hidden="true" />
                        <h2>Call Us</h2>
                        <p>Our team is available Monday–Saturday, 9 AM – 6 PM IST.</p>
                        <a href="tel:+919680886889" aria-label="Call Riyora Organic Customer Care">
                            +91 96808 86889
                        </a>
                    </article>

                    {/* Office Card */}
                    <article className={styles.card}>
                        <MapPin className={styles.icon} aria-hidden="true" />
                        <h2>Visit Us</h2>
                        <p>Riyora Organic Head Office</p>
                        <address className={styles.address}>
                            61 LG, Manglam Fun Square Mall<br />
                            Durga Nursery Rd, Shakti Nagar<br />
                            Udaipur, Rajasthan - 313001, India
                        </address>
                    </article>
                </section>
            </main>
        </>
    );
}
