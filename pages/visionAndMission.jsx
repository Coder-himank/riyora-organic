

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
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, voluptas omnis. Quam, delectus voluptates officiis ipsam, nam modi voluptatum consequuntur, totam qui fuga inventore autem repellat! Neque sit similique dignissimos harum beatae, quis ipsam ducimus magni reprehenderit voluptatem pariatur incidunt omnis, cumque nihil dolore numquam laboriosam id asperiores. Est dolor quam quos numquam, tempora soluta veniam, possimus consequuntur laudantium doloremque ducimus voluptatum minima quod, natus placeat nostrum odit? Voluptatibus iste molestias magnam dolorem quaerat rem recusandae veritatis sunt esse quam error sed aliquam, quo voluptatum quod eum. Neque voluptate ab quaerat, itaque aperiam nemo quas facere alias fugiat in deserunt!</p>
                </div>
            </section>

            <section className={styles.missionSection}>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.sectionText}>
                        Demo text: Our mission is to provide high-quality products and services that create value for our customers, foster growth, and contribute positively to society.
                    </p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, voluptas omnis. Quam, delectus voluptates officiis ipsam, nam modi voluptatum consequuntur, totam qui fuga inventore autem repellat! Neque sit similique dignissimos harum beatae, quis ipsam ducimus magni reprehenderit voluptatem pariatur incidunt omnis, cumque nihil dolore numquam laboriosam id asperiores. Est dolor quam quos numquam, tempora soluta veniam, possimus consequuntur laudantium doloremque ducimus voluptatum minima quod, natus placeat nostrum odit? Voluptatibus iste molestias magnam dolorem quaerat rem recusandae veritatis sunt esse quam error sed aliquam, quo voluptatum quod eum. Neque voluptate ab quaerat, itaque aperiam nemo quas facere alias fugiat in deserunt!</p>
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