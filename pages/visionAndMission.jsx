

import React from "react";
import styles from "@/styles/visionAndMission.module.css";

const VisionAndMission = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.mainTitle}>Our Vision & Mission</h1>
                <p className={styles.subtitle}>
                    Discover what drives us and where we are headed.
                </p>
            </header>

            <section className={styles.visionSection}>
                <div className={styles.imageWrapper}>
                    <img
                        src="https://via.placeholder.com/400x250"
                        alt="Vision"
                        className={styles.image}
                    />
                </div>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>Our Vision</h2>
                    <p className={styles.sectionText}>
                        Demo text: To be a global leader in delivering innovative solutions that empower individuals and organizations to achieve their fullest potential.
                    </p>
                </div>
            </section>

            <section className={styles.missionSection}>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.sectionText}>
                        Demo text: Our mission is to provide high-quality products and services that create value for our customers, foster growth, and contribute positively to society.
                    </p>
                </div>
                <div className={styles.imageWrapper}>
                    <img
                        src="https://via.placeholder.com/400x250"
                        alt="Mission"
                        className={styles.image}
                    />
                </div>
            </section>

            <section className={styles.valuesSection}>
                <h2 className={styles.sectionTitle}>Our Core Values</h2>
                <ul className={styles.valuesList}>
                    <li className={styles.valueItem}>Innovation</li>
                    <li className={styles.valueItem}>Integrity</li>
                    <li className={styles.valueItem}>Collaboration</li>
                    <li className={styles.valueItem}>Excellence</li>
                    <li className={styles.valueItem}>Customer Focus</li>
                </ul>
            </section>
        </div>
    );
};

export default VisionAndMission;