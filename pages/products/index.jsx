import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import styles from "@/styles/products.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session } = useSession();

  // Fetch products from API
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

  const siteUrl = "https://riyoraorganic.com";
  const pageTitle = "Riyora Organic Hair Oil - Natural & Ayurvedic Hair Care Products";
  const pageDescription =
    "Shop Riyora Organic Hair Oil products – 100% natural, chemical-free, Ayurvedic hair oils for strong, shiny, and healthy hair. Explore our range of organic hair care solutions.";
  const ogImage = `${siteUrl}/images/riyora-hair-oil.jpg`;

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        {/* Basic Meta */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Riyora Organic, Hair Oil, Ayurvedic Hair Care, Organic Hair Products, Natural Hair Oil, Healthy Hair, Chemical-Free" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteUrl}/products`} />

        {/* Open Graph / Social Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data: WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": pageTitle,
              "url": `${siteUrl}/products`,
              "description": pageDescription,
              "publisher": {
                "@type": "Organization",
                "name": "Riyora Organic",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/images/logo.png`
                }
              }
            })
          }}
        />
      </Head>
      <ToastContainer position="top-right" autoClose={3000} />
      <main>
        {/* Hero Section */}
        <section className={styles.hero} aria-label="Riyora Organic Hair Oil Hero Section">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Discover <span>Riyora</span> Natural Hair Care</h1>
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
                aria-label="Riyora Organic Hair Oil Bottle"
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className={styles.product_container} aria-label="Riyora Organic Hair Oil Products">
          <h2>Our <span>Products</span></h2>

          <div className={styles.product_list}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
              : products.length > 0
                ? products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    session={session}
                    router={router}
                    toast={toast}
                  />
                ))
                : <p className={styles.empty}>No Products Available</p>
            }
          </div>
        </section>
      </main>
    </>
  );
}
