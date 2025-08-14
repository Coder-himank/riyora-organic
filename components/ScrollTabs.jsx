"use client";
import { useState } from "react";
import styles from "./ScrollableTabs.module.css";

export default function ScrollableTabs({ items, limit = 10 }) {
    // Limit visible tabs and group the rest
    const visibleTabs = items.slice(0, limit);
    const overflowTabs = items.slice(limit);

    const [activeIndex, setActiveIndex] = useState(0);
    const [overflowIndex, setOverflowIndex] = useState(0); // For More tab cycling

    const isOverflowTabActive = activeIndex === limit;

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsWrapper}>
                {visibleTabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${styles.tabButton} ${activeIndex === index ? styles.active : ""
                            }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.label || `Tab ${index + 1}`}
                    </button>
                ))}

                {overflowTabs.length > 0 && (
                    <div className={styles.moreDropdown}>
                        <button
                            className={`${styles.tabButton} ${isOverflowTabActive ? styles.active : ""
                                }`}
                            onClick={() => {
                                setActiveIndex(limit);
                            }}
                        >
                            More ▾
                        </button>
                        {isOverflowTabActive && (
                            <div className={styles.dropdownMenu}>
                                {overflowTabs.map((tab, idx) => (
                                    <div
                                        key={idx}
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setOverflowIndex(idx);
                                        }}
                                    >
                                        {tab.label || `Extra ${idx + 1}`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.tabContent}>
                {isOverflowTabActive
                    ? overflowTabs[overflowIndex]?.content
                    : visibleTabs[activeIndex]?.content}
            </div>
        </div>
    );
}
