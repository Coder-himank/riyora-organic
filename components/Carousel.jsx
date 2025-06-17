import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css"; // Ensure this CSS file exists

const Carousel = ({ children }) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const [showActionButton, setShowActionButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [slideCount, setSlideCount] = useState(1);

    // Function to check if the action buttons should be visible
    const checkOverflow = useCallback(() => {
        if (!scrollRef.current || !containerRef.current || !scrollRef.current.children.length) return;

        const firstChild = scrollRef.current.children[0];
        if (!firstChild) return;

        const itemWidth = firstChild.offsetWidth + 10; // Account for margin
        const viewWidth = containerRef.current.offsetWidth;
        const totalWidth = scrollRef.current.scrollWidth + viewWidth;
        const totalItems = Math.ceil(totalWidth / itemWidth);
        const slides = Math.ceil(totalWidth / viewWidth)

        console.log("totalWidth", totalWidth);
        console.log("totalItems", totalItems);
        console.log("viewwidth", viewWidth);
        console.log("width to be", itemWidth * totalItems);
        console.log("slides", slides);



        setShowActionButton(totalWidth > containerRef.current.clientWidth);
        setSlideCount(slides > 0 ? slides : 1);
    }, []);

    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [checkOverflow]);

    // Function to update the current slide index
    const updateIndex = useCallback(() => {
        if (!scrollRef.current || !scrollRef.current.children.length) return;

        const firstChild = scrollRef.current.children[0];
        if (!firstChild) return;

        const itemWidth = firstChild.offsetWidth + 10; // Account for margin
        const scrollLeft = scrollRef.current.scrollLeft;

        setCurrentIndex(itemWidth > 0 ? Math.round(scrollLeft / itemWidth) + 1 : 1);
    }, []);

    // Scroll function
    const scroll = (direction) => {
        if (!scrollRef.current || !scrollRef.current.children.length) return;

        const firstChild = scrollRef.current.children[0];
        if (!firstChild) return;

        const scrollLeft = scrollRef.current.scrollLeft;
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const scrollAmount = firstChild.offsetWidth + 10; // Width of one card + margin

        if ((direction === "left" && scrollLeft === 0) ||
            (direction === "right" && scrollLeft + clientWidth >= scrollWidth)) {
            return;
        }

        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });

        setTimeout(updateIndex, 300); // Allow some time for smooth scrolling before updating index
    };

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
