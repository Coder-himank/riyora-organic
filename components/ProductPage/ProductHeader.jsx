import Link from "next/link";
import StarRating from "@/components/StartRating";
import styles from "@/styles/productPage.module.css";

export default function ProductHeader({ product }) {
    return (
        <>
            <div className={styles.paths}>
                <Link href="/">Home</Link> <span>/</span>
                <Link href="/products">Products</Link> <span>/</span>
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </div>

            <h1>{product.name}</h1>

            <Link href={"#reviews"}>
                <div className={styles.ratings}>
                    <StarRating rating={product.averageRating} />
                    <span>
                        {product.averageRating} ({product.numReviews})
                    </span>
                </div>
            </Link>
        </>
    );
}
