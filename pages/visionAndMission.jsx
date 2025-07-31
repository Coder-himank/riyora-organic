

import React from "react";
import styles from "@/styles/visionAndMission.module.css";
import Image from "next/image";
const VisionAndMission = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.mainTitle}>Our Vision & Mission</h1>
                <p className={styles.subtitle}>
                    Discover what drives us and where we are headed.
                </p>
            </div>

            <section className={styles.visionSection}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/logo.png"
                        // src="https://via.placeholder.com/400x250"
                        alt="Vision"
                        className={styles.image}
                        width={600}
                        height={600}
                    />
                </div>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>Our Vision</h2>
                    <p className={styles.sectionText}>
                        Demo text: To be a global leader in delivering innovative solutions that empower individuals and organizations to achieve their fullest potential.
                    </p>
                    <p>To empower individuals to embrace natural, effective, and honest self-care through time-tested Ayurvedic wisdom and modern science. Riyora Organic envisions a world where clean, herbal care becomes a daily ritual — free from Toxic chemicals, gimmicks, and false promises. We aim to restore trust in ancient plant-powered solutions while ensuring modern quality, elegance, and consistency.</p>
                </div>
            </section>

            <section className={styles.missionSection}>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.sectionText}>
                        Demo text: Our mission is to provide high-quality products and services that create value for our customers, foster growth, and contribute positively to society.
                    </p>
                    <p>At Riyora Organics, we believe that true beauty starts with balance—between nature and nurture, tradition and science, care and consistency.
                        In an age of synthetic shortcuts and chemical overload, we’re returning to the roots of health wellness with clean, powerful formulations inspired by Ayurveda and modern botanical research. Every bottle we create carries the essence of tradition, the rigour of science, and the purity of nature.
                    </p>
                </div>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/logo.png"
                        // src="https://via.placeholder.com/400x250"
                        alt="Mission"
                        className={styles.image}
                        width={600}
                        height={600}
                    />
                </div>
            </section>

            <section className={styles.valuesSection}>
                <h2 className={styles.sectionTitle}>Our Core Values</h2>
                <ul className={styles.valuesList}>
                    <li className={styles.valueItem}>Innovation - Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quod non a totam assumenda, fugit nesciunt aperiam dolores dolorem nobis?</li>
                    <li className={styles.valueItem}>Integrity- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quod non a totam assumenda, fugit nesciunt aperiam dolores dolorem nobis?</li>
                    <li className={styles.valueItem}>Collaboration- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quod non a totam assumenda, fugit nesciunt aperiam dolores dolorem nobis?</li>
                    <li className={styles.valueItem}>Excellence- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quod non a totam assumenda, fugit nesciunt aperiam dolores dolorem nobis?</li>
                    <li className={styles.valueItem}>Customer Focus- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius quod non a totam assumenda, fugit nesciunt aperiam dolores dolorem nobis?</li>
                </ul>
            </section>
        </div>
    );
};

export default VisionAndMission;