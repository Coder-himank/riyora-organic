import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import styles from "@/styles/products.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Products() {
  const [products, setProducts] = useState([]);
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

  const { router } = useRouter()
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Riyora Organic Hair Oil - Nourish Your Hair Naturally</title>
        <meta
          name="description"
          content="Discover Riyora Organic Hair Oil – 100% natural, chemical-free hair care for strong, shiny, and healthy hair."
        />
        <meta
          property="og:image"
          content="https://riyora-organic.vercel.app/images/riyora-hair-oil.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Discover <span>Riyora</span> Natural Care</h1>
            <p>
              Pure, organic, and chemical-free hair nourishment. Shop our natural blends crafted to restore shine and strength.
            </p>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/oil bottle.png"
              alt="Riyora Organic Hair Oil Bottle"
              width={320}
              height={420}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.product_container}>
        <h2>
          Our <span>Products</span>
        </h2>

        <div className={styles.product_list}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
            : products.length > 0
              ? products.map((product) => (
                <ProductCard key={product._id} product={product} session={session} router={router} />
              ))
              : <p className={styles.empty}>No Products Available</p>}
        </div>
      </section>
    </>
  );
}
