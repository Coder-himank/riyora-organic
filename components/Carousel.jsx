import { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/Carousel.module.css";
import React from "react";

const Carousel = ({ children, autoScroll = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const slideRef = useRef(null);

  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  // Loop infinitely by translating
  const goToSlide = useCallback((index) => {
    setIsAnimating(true);
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    const id = setInterval(() => {
      goToSlide((currentIndex + 1) % totalSlides);
    }, interval);
    return () => clearInterval(id);
  }, [currentIndex, goToSlide, autoScroll, interval, totalSlides]);

  // Handle manual controls
  const prevSlide = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };
  const nextSlide = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.sliderWrapper}
        ref={slideRef}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isAnimating ? "transform 0.5s ease" : "none",
        }}
      >
        {slides.map((slide, idx) => (
          <div className={styles.slide} key={idx}>
            {slide}
          </div>
        ))}
      </div>

      {/* Controls */}
      {totalSlides > 1 && (
        <>
          <button onClick={prevSlide} className={styles.scrollBtn}>
            ◀
          </button>
          <button onClick={nextSlide} className={styles.scrollBtn}>
            ▶
          </button>
        </>
      )}

      {/* Indicators */}
      <div className={styles.indicators}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={
              i === currentIndex ? styles.activeIndicator : styles.indicator
            }
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
