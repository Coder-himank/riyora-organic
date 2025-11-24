import InfiniteCarousel from "@/components/ImageCarousel";
import styles from "@/styles/productPage.module.css";

export default function ProductGallery({ images }) {
    return (
        <section className={styles.carousel}>
            <InfiniteCarousel images={images} />
        </section>
    );
}
