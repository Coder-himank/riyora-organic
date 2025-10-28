'use client'
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "@/styles/ImageCarousel.module.css";

export default function InfiniteCarousel({ images = [], autoPlay = true, interval = 3000 }) {
    const total = images.length;
    const [currentIndex, setCurrentIndex] = useState(1); // start at first real slide
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // Touch
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // ------------------------
    // Reset currentIndex if images change or empty
    // ------------------------
    useEffect(() => {
        if (!images || images.length === 0 || currentIndex > images.length) {
            setCurrentIndex(1); // reset to first slide
            setIsTransitioning(false);
        }
    }, [images, currentIndex]);

    // ------------------------
    // Autoplay
    // ------------------------
    useEffect(() => {
        if (!autoPlay || total <= 1) return;
        startAutoPlay();
        return () => clearInterval(intervalRef.current);
    }, [autoPlay, interval, total]);

    const startAutoPlay = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, interval);
    };

    const resetAutoPlay = () => {
        clearInterval(intervalRef.current);
        if (autoPlay && total > 1) startAutoPlay();
    };

    // ------------------------
    // Slide navigation
    // ------------------------
    const nextSlide = () => {
        if (total === 0) return;
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(true);
        resetAutoPlay();
    };

    const prevSlide = () => {
        if (total === 0) return;
        setCurrentIndex(prev => prev - 1);
        setIsTransitioning(true);
        resetAutoPlay();
    };

    const goToSlide = (index) => {
        if (total === 0) return;
        setCurrentIndex(index + 1); // +1 because of clone at start
        setIsTransitioning(true);
        resetAutoPlay();
    };

    // ------------------------
    // Handle transition end for infinite loop
    // ------------------------
    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(total);
        } else if (currentIndex === total + 1) {
            setIsTransitioning(false);
            setCurrentIndex(1);
        }
    };

    // Re-enable transition after index jump
    useEffect(() => {
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    // ------------------------
    // Swipe gestures
    // ------------------------
    const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
    const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        const threshold = 80;
        if (distance > threshold) nextSlide();
        else if (distance < -threshold) prevSlide();
    };

    if (!images || total === 0) return <div className={styles.carousel}>No images</div>;

    return (
        <div className={styles.carousel}>

            {/* Thumbnails */}
            {total > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${styles.thumb} ${currentIndex - 1 === idx ? styles.active : ''}`}
                            onClick={() => goToSlide(idx)}
                        >
                            <Image src={img} alt={`Thumb ${idx}`} width={100} height={70} />
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.sliderWrapper}>
                {total > 1 && (
                    <button className={styles.navBtn} onClick={prevSlide}>❮</button>
                )}

                <div
                    className={styles.sliderContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => { e.preventDefault() }}
                >
                    <div
                        className={styles.slider}
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {/* Clone last slide at start */}
                        {total > 1 && (
                            <div className={styles.slide}>
                                <Image src={images[total - 1]} alt="clone-last" width={900} height={900} />
                            </div>
                        )}

                        {/* Real slides */}
                        {images.map((img, idx) => (
                            <div className={styles.slide} key={idx}>
                                <Image src={img} alt={`Slide ${idx}`} width={900} height={900} />
                            </div>
                        ))}

                        {/* Clone first slide at end */}
                        {total > 1 && (
                            <div className={styles.slide}>
                                <Image src={images[0]} alt="clone-first" width={900} height={900} />
                            </div>
                        )}
                    </div>
                </div>

                {total > 1 && (
                    <button className={styles.navBtn} onClick={nextSlide}>❯</button>
                )}
            </div>
        </div>
    );
}
