import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css";
import Image from "next/image";
import React from "react";
const Carousel = ({ children, showControls = true, autoScroll = true, action_style = "overlap" }) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const lastManualScrollTime = useRef(Date.now()); // Track last manual scroll

    const [showActionButton, setShowActionButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [slideCount, setSlideCount] = useState(1);

    const checkOverflow = useCallback(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement || !containerRef.current) return;

        const childElements = Array.from(scrollElement.children);
        const containerWidth = containerRef.current.offsetWidth;

        const positions = childElements.map((child) => child.offsetLeft);
        const slidePositions = [...new Set(positions)]; // Unique starting x-coordinates
        const count = slidePositions.length;

        setSlideCount(count);
        showControls && setShowActionButton(count > 1);
    }, [showControls]);


    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [checkOverflow]);


    const updateIndex = useCallback(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement || !containerRef.current) return;

        const children = Array.from(scrollElement.children);
        const scrollLeft = scrollElement.scrollLeft;

        let closestIndex = 0;
        let closestDistance = Infinity;

        children.forEach((child, index) => {
            const distance = Math.abs(child.offsetLeft - scrollLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        setCurrentIndex(closestIndex + 1); // Convert to 1-based index
    }, []);


    const scroll = (direction, type = "auto") => {
        if (!scrollRef.current || !containerRef.current) return;

        const scrollAmount = containerRef.current.offsetWidth;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });

        // If it's a manual scroll, record time
        if (type === "manual") {
            lastManualScrollTime.current = Date.now();
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (!autoScroll || !scrollRef.current) return;

        let direction = "right";
        const interval = setInterval(() => {
            const now = Date.now();

            // Wait 5s after last manual scroll
            if (now - lastManualScrollTime.current < 5000) return;

            const scrollElement = scrollRef.current;
            const scrollLeft = scrollElement.scrollLeft;
            const scrollWidth = scrollElement.scrollWidth;
            const clientWidth = scrollElement.clientWidth;

            if (direction === "right") {
                if (scrollLeft + clientWidth >= scrollWidth - 1) {
                    direction = "left";
                } else {
                    scroll("right");
                }
            } else {
                if (scrollLeft <= 0) {
                    direction = "right";
                } else {
                    scroll("left");
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [autoScroll]);

    // Update index on manual scroll
    const handleScroll = () => {
        lastManualScrollTime.current = Date.now();
        updateIndex();
    };

    return (
        <div className={styles.carouselContainer} ref={containerRef}>
            <div className={styles.scrollContainer} ref={scrollRef} onScroll={handleScroll}>
                {children}
            </div>

            {showActionButton && slideCount > 1 && (
                <div className={`
                    ${styles.action_btn}
                    ${action_style === "overlap" && styles.action_btn_overlap}
                    ${action_style === "images" && styles.action_btn_img}
                    
                    `}>
                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("left", "manual")}
                        aria-label="Scroll Left"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && scroll("left", "manual")}
                    >
                        ◀
                    </button>

                    <div className={styles.indicators}>
                        {action_style === "images" ?
                            React.Children.map(children, (child, i) => {
                                const src = child.props?.src || "/fallback.jpg";

                                return (
                                    <span key={i} className={i + 1 === currentIndex ? styles.activeIndicator : styles.indicator}>
                                        <Image src={src} width={50} height={50} alt={`product image ${i + 1}`} />
                                    </span>
                                );
                            })


                            :
                            Array.from({ length: slideCount - 1 }, (_, i) => (

                                <span key={i} className={i + 1 === currentIndex ? styles.activeIndicator : styles.indicator}></span>
                            ))


                        }
                    </div>

                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("right", "manual")}
                        aria-label="Scroll Right"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && scroll("right", "manual")}
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Carousel;
