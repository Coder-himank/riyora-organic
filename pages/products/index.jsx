import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard, { SkeletonCard } from "@/components/ProductCard";
import styles from "@/styles/products.module.css";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Products() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await axios.get("/api/getProducts");
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
      <>
        <div className={styles.product_container}>
          <h2>Our Products</h2>
          <div className={styles.product_list}>
            {Array.from({ length: 2 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (products.length === 0) return <h1>No Products Available</h1>;

  return (
    <>
      <div className={styles.product_container}>
        <h2>Our <span>Products</span></h2>
        <div className={styles.product_list}>
          {
            !products ? (<>
              {Array.from({ length: 10 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </>) : (<>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </>)
          }
        </div>
      </div>
    </>
  );
}
