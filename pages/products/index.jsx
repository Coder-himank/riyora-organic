import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard, { SkeletonCard } from "@/components/ProductCard";
import styles from "@/styles/products.module.css";
import ProductSkeleton from "@/components/ProductSkeleton";
import Head from "next/head";
import Image from "next/image";

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
        <Head>
          <title>Riyora Organic Hair Oil - Nourish Your Hair Naturally</title>
          <meta name="description" content="Discover Riyora Organic Hair Oil – 100% natural, chemical-free hair care for strong, shiny, and healthy hair. Shop now at riyora-organic.vercel.app." />
          <meta name="keywords" content="Riyora, Organic Hair Oil, Natural Hair Care, Herbal Oil, Hair Growth, Chemical-Free, Hair Products" />
          <meta property="og:title" content="Riyora Organic Hair Oil" />
          <meta property="og:description" content="Nourish your hair with Riyora Organic Hair Oil. Pure, natural ingredients for healthy, beautiful hair." />
          <meta property="og:type" content="product" />
          <meta property="og:url" content="https://riyora-organic.vercel.app/products" />
          <meta property="og:image" content="https://riyora-organic.vercel.app/images/riyora-hair-oil.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Riyora Organic Hair Oil" />
          <meta name="twitter:description" content="Shop Riyora Organic Hair Oil for natural, effective hair care." />
          <meta name="twitter:image" content="https://riyora-organic.vercel.app/images/riyora-hair-oil.jpg" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "Riyora Organic Hair Oil",
                "image": [
                  "https://riyora-organic.vercel.app/images/riyora-hair-oil.jpg"
                ],
                "description": "Riyora Organic Hair Oil is a 100% natural, chemical-free solution for strong, shiny, and healthy hair. Enriched with herbal ingredients for all hair types.",
                "brand": {
                  "@type": "Brand",
                  "name": "Riyora"
                },
                "offers": {
                  "@type": "Offer",
                  "url": "https://riyora-organic.vercel.app/products",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock"
                }
              })
            }}
          />
        </Head>
        <div className={styles.product_container}>
          <h2>
            Our <span>Products</span>
          </h2>
          <div className={styles.product_list}>
            {Array.from({ length: 2 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Image
              src="/images/riyora-hair-oil.jpg"
              alt="Riyora Organic Hair Oil Bottle"
              width={300}
              height={400}
              priority
            />
            <p>
              <strong>Riyora Organic Hair Oil</strong> is crafted with pure, natural ingredients to nourish your scalp and promote healthy hair growth. Experience the power of nature with our chemical-free, herbal formula designed for all hair types.
            </p>
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
