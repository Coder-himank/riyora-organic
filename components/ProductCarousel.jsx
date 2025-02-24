import { useRef } from "react";
import styles from "@/styles/ProductCarousel.module.css"; // Create this CSS file
import Image from "next/image";
import Link from "next/link";
const ProductCarousel = ({ products }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.children[0].offsetWidth + 16; // Width of one card + margin
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className={styles.carouselContainer}>
            <button className={styles.scrollBtn} onClick={() => scroll("left")}>
                ◀
            </button>
            <div className={styles.scrollContainer} ref={scrollRef}>
                {products.map((product, index) => (
                    <div key={index} className={styles.productCard}>
                        <Image src={product.image} alt={product.name} width={300} height={300} />
                        <section className={styles.product_info}>

                            <h3>{product.name}</h3>
                            {/* <p>${product.price}</p> */}
                            <Link href={`/products`}>Read More </Link>
                        </section>
                    </div>
                ))}
            </div>
            <button className={styles.scrollBtn} onClick={() => scroll("right")}>
                ▶
            </button>
        </div>
    );
};

export default ProductCarousel;
