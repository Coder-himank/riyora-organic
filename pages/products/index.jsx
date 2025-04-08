import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard, { SkeletonCard } from "@/components/ProductCard";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "@/styles/products.module.css";

export default function Products() {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.product_container}>
        <div className="navHolder"></div>
        <h1>{t("our_products")}</h1>
        <div className={styles.product_list}>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return <h1>No Products Available</h1>;

  return (
    <div className={styles.product_container}>
      <div className={styles.banner}>
      </div>
      <h1>{t("our_products")}</h1>
      <div className={styles.product_list}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
