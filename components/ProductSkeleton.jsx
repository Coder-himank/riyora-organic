import styles from '@/styles/product-card.module.css';
const ProductSkeleton = () => {
    return (
        <>
            <div className={styles.productSkeleton}>
                <div className={styles.imageSkeleton}>
                </div>

                <section>
                    <div className={styles.skeletonText}>
                    </div>

                    <div className={styles.skeletonButton}>
                    </div>

                </section>
            </div>
        </>
    );
}

export default ProductSkeleton;