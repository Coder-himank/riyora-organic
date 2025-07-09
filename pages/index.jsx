import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import Carousel from "@/components/Carousel";
import Head from "next/head";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { FaArrowRight, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import Blog from "@/components/blog";
import { useEffect, useState } from "react";
import BlogSkeleton from "@/components/BlogSkeleton";
import ProductSkeleton from "@/components/ProductSkeleton";
import ReviewCard from "@/components/ReviewCard";
export default function Home() {

  const { locale } = useRouter(); // Get the current locale


  const [products, setProducts] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts?type=trending"); // Replace with your API endpoint
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    }

    const fetchBlogs = async () => {
      try {

        const res = await fetch("/api/getblogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setBlogsLoading(false);
      }
    }

    fetchBlogs()
    fetchProducts()

  }, [])
  const { publicRuntimeConfig } = getConfig()
  const site_url = publicRuntimeConfig.BASE_URL


  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Home - Your Brand Name</title>
        <meta name="description" content="Welcome to our website. Discover the best products and services we offer." />
        <meta name="keywords" content="organic, products, health, wellness, natural" />
        <meta name="author" content="Your Brand Name" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="hi,en" />
        <link rel="canonical" href="https://your-site-url.com/en" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-site-url.com" />
        <meta property="og:title" content="Home - Your Brand Name" />
        <meta property="og:description" content="Welcome to our website. Discover the best products and services we offer." />
        <meta property="og:image" content="https://your-site-url.com/images/og-image.jpg" />
        <meta property="og:locale" content="hi_IN" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://your-site-url.com" />
        <meta name="twitter:title" content="Home - Your Brand Name" />
        <meta name="twitter:description" content="Welcome to our website. Discover the best products and services we offer." />
        <meta name="twitter:image" content="https://your-site-url.com/images/twitter-image.jpg" />

        {/* JSON-LD Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://your-site-url.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://your-site-url.com/products"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Login",
                "item": "https://your-site-url.com/authenticate"
              }
            ]
          })}
        </script>
      </Head>

      <div className="navHolder"></div>
      <div className={styles.home_container}>
        {/* Hero Section */}
        <motion.div className={styles.hero_section} viewport={{ once: true }}>

          <motion.section className={styles.hero_section_in1} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>

            <div className={styles.hero_text}>
              <div className={styles.hero_head}>

                <h1 className={styles.glow_text}>Welcome to Our Brand</h1>
                <p className={styles.subtext}>Discover the best products for a healthy and happy life.</p>
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={styles.shop_btn} viewport={{ once: true }}>
                <Link href="/products">Shop Now</Link>
              </motion.div>
            </div>

          </motion.section>

        </motion.div>


        {/* Trending Products Section */}
        <motion.section className={styles.trending_product} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>Best <span>Selling Products</span></h2>
          <motion.section className={styles.trending_product} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
            <Carousel>
              {!products ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : products.length === 0 ? (<>No Products</>) :
                (
                  products.map((product, index) => (
                    <ProductCard product={product} />
                  ))

                )
              }
            </Carousel>
          </motion.section>
        </motion.section>

        {/* Benefits Section */}
        <motion.section className={styles.benefits_section} viewport={{ once: true }}>

          <div className={styles.benefit_card_holder}>

            <div className={styles.benefit_card}>
              <Image src={"/images/plant.png"} width={200} height={200} alt="No Chemicals" />
              <span>No Chemicals</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/nutrition.png"} width={200} height={200} alt="Rich in Nutrients" />
              <span>Rich in Nutrients</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/enviornment.png"} width={200} height={200} alt="Environment Friendly" />
              <span>Environment Friendly</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/muscle.png"} width={200} height={200} alt="Better for Health" />
              <span>Better for Health</span>
            </div>
          </div>

        </motion.section>
        {/* Blogs Section */}
        <motion.section className={styles.blogs} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>Enchant <span>Yourself</span></h2>

          {!blogs ? (<>
            <section className={styles.blog_in}>
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogSkeleton key={index} />
              ))}

            </section>
          </>) : (<>
            <section className={styles.blog_in}>

              {blogs.map((blog, index) => (
                <Blog key={index} {...blog} />
              ))}
            </section>
          </>)}

          <Link href={"/blogs"}>Load More</Link>
        </motion.section>

        {/* About Section */}
        <motion.section className={styles.about_section} viewport={{ once: true }}>
          <div className={styles.about_in}>



            <motion.div
              initial={{ x: 0, y: -40, opacity: 0.3 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.5 }}
              className={styles.about_image}
              viewport={{ once: true }}
            >
              <div className={styles.about_img_1}>

                <Image src={"/Riyora-Logo-Favicon.png"} alt="About Rivora" width={500} height={500} />
              </div>
              <div className={styles.about_img_2}>
                <Image src={"/Riyora-Logo-Favicon.png"} alt="About Rivora" width={500} height={500} />

              </div>
            </motion.div>
            <motion.div
              initial={{ x: 0, y: 40, opacity: 0.3 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.5 }}
              className={styles.about_text}
              viewport={{ once: true }}
            >
              <h3>Know About Us</h3>
              <Link href={"/about"}>Learn More</Link>
            </motion.div>

          </div>
        </motion.section>

        {/* Effectiveness Section */}
        <motion.section className={styles.effects} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>CHanging <span>Lifes</span></h2>
          <motion.section className={styles.effects_cards} viewport={{ once: true }}>
            <Image src={"/images/effectiveness_image_1.jpg"} width={500} height={400} alt="Before using products" />
            <Image src={"/images/effectiveness_image_2.jpg"} width={500} height={400} alt="After using products" />
          </motion.section>
          <motion.section className={styles.effects_cards} viewport={{ once: true }}>
            <Image src={"/images/effectiveness_image_1.jpg"} width={500} height={400} alt="Before using products" />
            <Image src={"/images/effectiveness_image_2.jpg"} width={500} height={400} alt="After using products" />
          </motion.section>
          <motion.section className={styles.effects_cards} viewport={{ once: true }}>
            <Image src={"/images/effectiveness_image_1.jpg"} width={500} height={400} alt="Before using products" />
            <Image src={"/images/effectiveness_image_2.jpg"} width={500} height={400} alt="After using products" />
          </motion.section>
        </motion.section>

        {/* Reviews Section */}
        <motion.section className={styles.reviews_section} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>Customer <span>Reviews</span></h2>
          <motion.section initial={{ opacity: 0.5, x: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
            <div className={styles.review_in}>
              {/* <Carousel showControls={false} autoScroll={true}> */}


              {Array.from({ length: 4 }).map((_, index) => (
                <ReviewCard />
              ))}
              {/* </Carousel> */}
            </div>

          </motion.section>
        </motion.section>

        {/* Services Section */}
        <div className={styles.services}>
          <h2 className={styles.home_h2}>Our <span>Services</span></h2>
          <div className={styles.service_banner}>
            <h3>Customize your Product <span><FaArrowRight /></span></h3>
            <Image src={"/images/ayurveda-utensils.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil_bottel_repat.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil_bottle_black.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil-banner.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
        </div>
      </div>

    </>
  );
}
