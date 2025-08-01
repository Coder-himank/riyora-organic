import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css";
import Image from "next/image";
import React from "react";

const Carousel = ({
    children,
    showControls = true,
    autoScroll = true,
    action_style = "overlap",
}) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const lastManualScrollTime = useRef(Date.now());

    const [showActionButton, setShowActionButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [slidePositions, setSlidePositions] = useState([]);

    // ✅ Calculates slide positions based on offsetLeft
    const checkOverflow = useCallback(() => {
        requestAnimationFrame(() => {
            const scrollElement = scrollRef.current;
            if (!scrollElement) return;

            const childrenArray = Array.from(scrollElement.children);
            const positions = childrenArray.map((child) => child.offsetLeft);
            const uniquePositions = [...new Set(positions)];

            setSlidePositions(uniquePositions);
            showControls && setShowActionButton(uniquePositions.length > 1);
        });
    }, [showControls]);

    // ✅ Updates current index based on scrollLeft
    const updateIndex = useCallback(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const scrollLeft = scrollElement.scrollLeft;

        let closestIndex = 0;
        let closestDistance = Infinity;

        slidePositions.forEach((pos, index) => {
            const distance = Math.abs(pos - scrollLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        setCurrentIndex(closestIndex + 1);
    }, [slidePositions]);

    // ✅ Scroll left or right
    const scroll = (direction, type = "auto") => {
        if (!scrollRef.current || slidePositions.length === 0) return;

        const currentIdx = currentIndex - 1;
        let targetIdx = direction === "right" ? currentIdx + 1 : currentIdx - 1;

        // Clamp the index
        targetIdx = Math.max(0, Math.min(slidePositions.length - 1, targetIdx));

        scrollRef.current.scrollTo({
            left: slidePositions[targetIdx],
            behavior: "smooth",
        });

        if (type === "manual") {
            lastManualScrollTime.current = Date.now();
        }
    };

    // ✅ Watch for size changes of children
    useEffect(() => {
        checkOverflow();

        if (action_style === "images") {
            setShowActionButton(true)
        }

        const observer = new ResizeObserver(() => {
            checkOverflow();
        });

        if (scrollRef.current) {
            observer.observe(scrollRef.current);
        }

        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
            observer.disconnect();
        };
    }, [checkOverflow, children]);

    // ✅ Watch scroll and update index
    const handleScroll = () => {
        lastManualScrollTime.current = Date.now();
        updateIndex();
    };

    // ✅ Auto-scroll effect
    useEffect(() => {
        if (!autoScroll || slidePositions.length <= 1) return;

        let direction = "right";
        const interval = setInterval(() => {
            const now = Date.now();
            if (now - lastManualScrollTime.current < 5000) return;

            const lastIndex = slidePositions.length;
            if (direction === "right") {
                if (currentIndex >= lastIndex) {
                    direction = "left";
                    scroll("left");
                } else {
                    scroll("right");
                }
            } else {
                if (currentIndex <= 1) {
                    direction = "right";
                    scroll("right");
                } else {
                    scroll("left");
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [autoScroll, currentIndex, slidePositions]);

    return (
        <div className={styles.carouselContainer} ref={containerRef}>
            <div
                className={styles.scrollContainer}
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {children}
            </div>

            {(showActionButton && slidePositions.length > 1) && (
                <div
                    className={`
            ${styles.action_btn}
            ${action_style === "overlap" && styles.action_btn_overlap}
            ${action_style === "images" && styles.action_btn_img}
          `}
                >
                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("left", "manual")}
                        aria-label="Scroll Left"
                        tabIndex={0}
                        onKeyDown={(e) =>
                            e.key === "Enter" && scroll("left", "manual")
                        }
                    >
                        ◀
                    </button>

                    <div className={styles.indicators}>
                        {action_style === "images"
                            ? React.Children.map(children, (child, i) => {
                                const src = child.props?.src || "/fallback.jpg";
                                return (
                                    <span
                                        key={i}
                                        className={
                                            i + 1 === currentIndex
                                                ? styles.activeIndicator
                                                : styles.indicator
                                        }
                                    >
                                        <Image
                                            src={src}
                                            width={50}
                                            height={50}
                                            alt={`slide ${i + 1}`}
                                        />
                                    </span>
                                );
                            })
                            : slidePositions.map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i + 1 === currentIndex
                                            ? styles.activeIndicator
                                            : styles.indicator
                                    }
                                ></span>
                            ))}
                    </div>

                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("right", "manual")}
                        aria-label="Scroll Right"
                        tabIndex={0}
                        onKeyDown={(e) =>
                            e.key === "Enter" && scroll("right", "manual")
                        }
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Carousel;
