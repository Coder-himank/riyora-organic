"use client";
import { useState } from "react";
import styles from "@/styles/tabs.module.css";

export default function Tabs({ tabs }) {
    const tabNames = Object.keys(tabs);
    const [activeTab, setActiveTab] = useState(tabNames[0]);

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabHeader}>
                {tabNames.map((tab) => (
                    <div
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className={styles.tabContent}>{tabs[activeTab]}</div>
        </div>
    );
}
