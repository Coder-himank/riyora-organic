import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ImageCarousel.module.css";
import Image from "next/image";
import { MdHelpOutline } from "react-icons/md";

export default function InfiniteCarousel({ images, autoPlay = true, interval = 3000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const total = images.length;

    // Auto slide
    useEffect(() => {
        if (!autoPlay) return;

        const auto = () => setCurrentIndex((prev) => (prev + 1) % total);
        timeoutRef.current = setInterval(auto, interval);

        return () => clearInterval(timeoutRef.current);
    }, [autoPlay, interval, total]); // <- no currentIndex here

    const goToSlide = (index) => {
        setCurrentIndex(index);
        console.log("hello");
    };

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % total);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

    return (
        <div className={styles.carousel}>
            {/* Slider */}
            <div className={styles.sliderWrapper}>
                <button className={styles.navBtn} onClick={prevSlide}>❮</button>
                <div className={styles.sliderContainer}>
                    <div
                        className={styles.slider}
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((img, idx) => (
                            <div className={styles.slide} key={idx}>
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
                    </div>
                </div>
                <button className={styles.navBtn} onClick={nextSlide}>❯</button>
            </div>

            {/* Thumbnails */}
            <div className={styles.thumbnails}>
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`${styles.thumb} ${currentIndex === idx ? styles.active : ""}`}
                        onClick={() => goToSlide(idx)}
                    >
                        <Image src={img} alt={`Thumb ${idx}`} width={100} height={70} />
                    </div>
                ))}
            </div>
        </div>
    );
}
