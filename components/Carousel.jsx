import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css"; // Ensure this CSS file exists

const Carousel = ({ children, showControls = true, autoScroll = true }) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const [showActionButton, setShowActionButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [slideCount, setSlideCount] = useState(1);

    // Function to check if the action buttons should be visible
    const checkOverflow = useCallback(() => {
        if (!scrollRef.current || !containerRef.current || !scrollRef.current.children.length) return;

        const totalWidth = scrollRef.current.scrollWidth;
        const viewWidth = containerRef.current.offsetWidth;

        const slides = Math.ceil(totalWidth / viewWidth);
        showControls && setShowActionButton(slides > 1);
        setSlideCount(slides > 0 ? slides : 1);
    }, []);


    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [checkOverflow]);

    // Function to update the current slide index
    const updateIndex = useCallback(() => {
        if (!scrollRef.current || !containerRef.current) return;

        const scrollLeft = scrollRef.current.scrollLeft;
        const containerWidth = containerRef.current.offsetWidth;

        // Use container width to calculate which "page" you're on
        const index = Math.round(scrollLeft / containerWidth) + 1;

        setCurrentIndex(index > 0 ? index : 1);
    }, []);


    // Scroll function
    const scroll = (direction) => {
        if (!scrollRef.current || !containerRef.current) return;

        const scrollAmount = containerRef.current.offsetWidth;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });

        setTimeout(updateIndex, 300); // Allow time for smooth scroll to finish
    };


    useEffect(() => {
        if (!autoScroll || !scrollRef.current) return;

        let direction = "right"; // initial scroll direction
        const scrollInterval = setInterval(() => {
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
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(scrollInterval); // Clean up on unmount
    }, [autoScroll, updateIndex]); // Add dependencies

    return (
        <div className={styles.carouselContainer} ref={containerRef}>
            <div className={styles.scrollContainer} ref={scrollRef} onScroll={updateIndex}>
                {children}
            </div>

            {showActionButton && slideCount > 1 && (
                <div className={styles.action_btn}>
                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("left")}
                        aria-label="Scroll Left"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && scroll("left")}
                    >
                        ◀
                    </button>

                    <div className={styles.indicators}>
                        {Array.from({ length: slideCount - 1 }, (_, i) => (
                            <span key={i} className={i + 1 === currentIndex ? styles.activeIndicator : styles.indicator}></span>
                        ))}
                    </div>

                    <button
                        className={styles.scrollBtn}
                        onClick={() => scroll("right")}
                        aria-label="Scroll Right"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && scroll("right")}
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Carousel;
