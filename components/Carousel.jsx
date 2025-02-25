import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css"; // Ensure this CSS file exists

const ProductCarousel = ({ children }) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const [showActionButton, setShowActionButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [slideCount, setSlideCount] = useState(1);

    // Function to check if the action buttons should be visible
    const checkOverflow = useCallback(() => {
        if (scrollRef.current && containerRef.current) {
            setShowActionButton(scrollRef.current.scrollWidth > containerRef.current.clientWidth);

            // Correct calculation for the number of slides
            const itemWidth = scrollRef.current.children[0]?.offsetWidth + 10 || 0;
            if (itemWidth > 0) {
                setSlideCount(Math.ceil(scrollRef.current.scrollWidth / itemWidth));
            }
        }
    }, []);

    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [checkOverflow]);

    // Function to update the current slide index
    const updateIndex = useCallback(() => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const itemWidth = scrollRef.current.children[0]?.offsetWidth + 10 || 0; // Width of one card + margin
            if (itemWidth > 0) {
                setCurrentIndex(Math.round(scrollLeft / itemWidth) + 1);
            }
        }
    }, []);

    // Scroll function
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const scrollWidth = scrollRef.current.scrollWidth;
            const clientWidth = scrollRef.current.clientWidth;
            const scrollAmount = scrollRef.current.children[0]?.offsetWidth + 10 || 0; // Width of one card + margin

            if (direction === "left" && scrollLeft === 0) return;
            if (direction === "right" && scrollLeft + clientWidth >= scrollWidth) return;

            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });

            setTimeout(updateIndex, 300); // Allow some time for smooth scrolling before updating index
        }
    };

    return (
        <div className={styles.carouselContainer} ref={containerRef}>
            <div className={styles.scrollContainer} ref={scrollRef} onScroll={updateIndex}>
                {children}
            </div>

            {showActionButton && (
                <div className={styles.action_btn}>
                    <button className={styles.scrollBtn} onClick={() => scroll("left")}>◀</button>
                    <div className={styles.indicators}>

                        {Array.from({ length: slideCount - 1 }, (_, i) => (
                            <span key={i} className={i + 1 === currentIndex ? styles.activeIndicator : styles.indicator}></span>
                        ))}
                    </div>
                    <button className={styles.scrollBtn} onClick={() => scroll("right")}>▶</button>
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;
