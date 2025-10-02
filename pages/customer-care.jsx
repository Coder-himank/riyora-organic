import Head from "next/head";
import styles from "@/styles/customerCare.module.css";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CustomerCare() {
    return (
        <>
            <Head>
                <title>Customer Care | Riyora Organic</title>
                <meta
                    name="description"
                    content="Get in touch with Riyora Organic customer care. Reach us via email, phone, or visit our office."
                />
            </Head>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Customer Care</h1>
                    <p>
                        We’re here to help you with any queries about Riyora Organic. Contact us through the options below.
                    </p>
                </div>

                <div className={styles.cards}>
                    {/* Email Card */}
                    <div className={styles.card}>
                        <Mail className={styles.icon} />
                        <h2>Email Us</h2>
                        <p>Send us your queries or feedback anytime.</p>
                        <a href="mailto:care@riyoraorganic.com">
                            care@riyoraorganic.com
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className={styles.card}>
                        <Phone className={styles.icon} />
                        <h2>Call Us</h2>
                        <p>Our team is available Mon–Sat, 9 AM – 6 PM.</p>
                        <a href="tel:++919680886889">++91 96808 86889</a>
                    </div>

                    {/* Office Card */}
                    <div className={styles.card}>
                        <MapPin className={styles.icon} />
                        <h2>Visit Us</h2>
                        <p>Riyora Organic Head Office</p>
                        <p className={styles.address}>
                            61 LG, Manglam Fun Square Mall <br /> Durga Nursery Rd, Shakti Nagar <br /> Udaipur, Rajasthan -313001 India
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
