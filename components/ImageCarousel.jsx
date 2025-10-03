import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ImageCarousel.module.css";
import Image from "next/image";

export default function InfiniteCarousel({ images, autoPlay = true, interval = 3000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);
    const total = images.length;

    // Touch handling
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Autoplay
    useEffect(() => {
        if (!autoPlay || total <= 1) return; // no autoplay if only one image
        startAutoPlay();
        return () => clearInterval(intervalRef.current);
    }, [autoPlay, interval, total]);

    const startAutoPlay = () => {
        if (total <= 1) return;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            nextSlide();
        }, interval);
    };

    const resetAutoPlay = () => {
        clearInterval(intervalRef.current);
        if (autoPlay && total > 1) {
            startAutoPlay();
        }
    };

    // Slide functions
    const nextSlide = () => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(true);
        resetAutoPlay();
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(true);
        resetAutoPlay();
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsTransitioning(true);
        resetAutoPlay();
    };

    // Infinite loop fix with clones
    const handleTransitionEnd = () => {
        if (currentIndex === total) {
            // at clone of first slide → jump to 0
            setIsTransitioning(false);
            setCurrentIndex(0);
        } else if (currentIndex === -1) {
            // at clone of last slide → jump to last index
            setIsTransitioning(false);
            setCurrentIndex(total - 1);
        }
    };

    // Swipe gestures
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum swipe distance
        if (distance > threshold) {
            nextSlide(); // swipe left → next
        } else if (distance < -threshold) {
            prevSlide(); // swipe right → prev
        }
    };

    return (
        <div className={styles.carousel}>
            {/* Slider */}
            <div className={styles.sliderWrapper}>
                {total > 1 && (
                    <button
                        className={styles.navBtn}
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                    >
                        ❮
                    </button>
                )}
                <div
                    className={styles.sliderContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={styles.slider}
                        style={{
                            transform: `translateX(-${(currentIndex + 1) * 100}%)`,
                            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {/* Clone of last slide at beginning */}
                        {total > 1 && (
                            <div className={styles.slide} id="slide-clone-last">
                                <Image
                                    src={images[total - 1]}
                                    alt="Slide clone last"
                                    width={900}
                                    height={500}
                                    className={styles.image}
                                    priority
                                />
                            </div>
                        )}

                        {/* Real slides */}
                        {images.map((img, idx) => (
                            <div className={styles.slide} key={idx} id={`slide-${idx}`}>
                                <Image
                                    src={img}
                                    alt={`Slide ${idx}`}
                                    width={900}
                                    height={500}
                                    className={styles.image}
                                    priority
                                />
                            </div>
                        ))}

                        {/* Clone of first slide at end */}
                        {total > 1 && (
                            <div className={styles.slide} id="slide-clone-first">
                                <Image
                                    src={images[0]}
                                    alt="Slide clone first"
                                    width={900}
                                    height={500}
                                    className={styles.image}
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>
                {total > 1 && (
                    <button
                        className={styles.navBtn}
                        onClick={nextSlide}
                        aria-label="Next Slide"
                    >
                        ❯
                    </button>
                )}
            </div>

            {/* Thumbnails */}
            {total > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${styles.thumb} ${currentIndex === idx ? styles.active : ""}`}
                            onClick={() => goToSlide(idx)}
                            id={`thumb-${idx}`}
                        >
                            <Image src={img} alt={`Thumb ${idx}`} width={100} height={70} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
