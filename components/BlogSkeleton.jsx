import styles from "@/styles/blogComponent.module.css";

const BlogSkeleton = () => {
    return (
        <div className={styles.blogSkeletonBox}>
            <section>

                <div className={styles.sekeltonImage}></div>
            </section>
            <section>

                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonButton}></div>
            </section>
        </div>
    );
}

export default BlogSkeleton;