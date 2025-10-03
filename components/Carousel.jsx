import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@/styles/Carousel.module.css";
import Image from "next/image";
import React from "react";

const Carousel = ({
  children,
  showControls = true,
  autoScroll = true,
  action_style = "overlap",
  intervalTime = 3000,
}) => {
  const scrollRef = useRef(null);
  const lastManualScrollTime = useRef(Date.now());

  const [showActionButton, setShowActionButton] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1); // start at 1 (real first)
  const [slidePositions, setSlidePositions] = useState([]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const scrollTimeout = useRef(null);

  // ✅ Clone children
  const clonedChildren = [
    React.cloneElement(children[children.length - 1], { key: "clone-last" }),
    ...children,
    React.cloneElement(children[0], { key: "clone-first" }),
  ];

  // ✅ Calculate slide positions
  const checkOverflow = useCallback(() => {
    requestAnimationFrame(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;

      const childrenArray = Array.from(scrollElement.children);
      const positions = childrenArray.map((child) => child.offsetLeft);

      setSlidePositions(positions);
      showControls && setShowActionButton(positions.length > 1);

      // Snap to "real" first slide initially
      if (positions.length > 1) {
        scrollElement.scrollTo({
          left: positions[1],
          behavior: "instant",
        });
      }
    });
  }, [showControls]);

  // ✅ Update index during scroll
  const updateIndex = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || slidePositions.length === 0) return;

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

    setCurrentIndex(closestIndex);
  }, [slidePositions]);

  // ✅ Handle infinite looping after scroll ends
  const handleScroll = () => {
    lastManualScrollTime.current = Date.now();
    updateIndex();

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement || slidePositions.length === 0) return;

      const scrollLeft = scrollElement.scrollLeft;

      if (scrollLeft >= slidePositions[slidePositions.length - 1] - 1) {
        // jumped to clone-first → reset to real first
        scrollElement.scrollTo({ left: slidePositions[1], behavior: "instant" });
        setCurrentIndex(1);
      }

      if (scrollLeft <= slidePositions[0] + 1) {
        // jumped to clone-last → reset to real last
        const lastReal = slidePositions.length - 2;
        scrollElement.scrollTo({
          left: slidePositions[lastReal],
          behavior: "instant",
        });
        setCurrentIndex(lastReal);
      }
    }, 100); // debounce scroll end
  };

  // ✅ Scroll left/right
  const scroll = (direction, type = "auto") => {
    if (!scrollRef.current || slidePositions.length === 0) return;

    let targetIdx = currentIndex + (direction === "right" ? 1 : -1);

    scrollRef.current.scrollTo({
      left: slidePositions[targetIdx],
      behavior: "smooth",
    });

    if (type === "manual") {
      lastManualScrollTime.current = Date.now();
    }
  };

  // ✅ Resize observer
  useEffect(() => {
    checkOverflow();

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

  // ✅ Auto-scroll
  useEffect(() => {
    if (!autoScroll || slidePositions.length <= 1) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastManualScrollTime.current < 5000) return;

      scroll("right");
    }, intervalTime);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex, slidePositions, intervalTime]);

  // ✅ Swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (distance > threshold) {
      scroll("right", "manual");
    } else if (distance < -threshold) {
      scroll("left", "manual");
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.scrollContainer}
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {clonedChildren}
      </div>

      {showActionButton && slidePositions.length > 1 && (
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
          >
            ◀
          </button>

          {/* Indicators */}
          <div className={styles.indicators}>
            {children.map((child, i) => {
              const src = child.props?.src || "/fallback.jpg";
              return action_style === "images" ? (
                <span
                  key={i}
                  className={
                    i + 1 === currentIndex
                      ? styles.activeIndicator
                      : styles.indicator
                  }
                  onClick={() =>
                    scrollRef.current.scrollTo({
                      left: slidePositions[i + 1],
                      behavior: "smooth",
                    })
                  }
                >
                  <Image src={src} width={50} height={50} alt={`slide ${i}`} />
                </span>
              ) : (
                <span
                  key={i}
                  className={
                    i + 1 === currentIndex
                      ? styles.activeIndicator
                      : styles.indicator
                  }
                  onClick={() =>
                    scrollRef.current.scrollTo({
                      left: slidePositions[i + 1],
                      behavior: "smooth",
                    })
                  }
                ></span>
              );
            })}
          </div>

          <button
            className={styles.scrollBtn}
            onClick={() => scroll("right", "manual")}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
