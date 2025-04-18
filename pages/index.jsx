import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
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

export default function Home() {
  const { t } = useTranslation("common");

  const { locale } = useRouter(); // Get the current locale


  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?type=trending"); // Replace with your API endpoint
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    }

    const fetchBlogs = async () => {
      try {

        const res = await fetch("/api/blogs"); // Replace with your API endpoint
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
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description")} />
        <meta name="keywords" content={t("home.meta.keywords")} />
        <meta name="author" content={t("brand_name")} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="hi,en" />
        <link rel="canonical" href={`${site_url}/${locale}`} />


        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={site_url} />
        <meta property="og:title" content={t("home.meta.title")} />
        <meta property="og:description" content={t("home.meta.description")} />
        <meta property="og:image" content={`${site_url}/images/og-image.jpg`} />
        <meta property="og:locale" content="hi_IN" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={site_url} />
        <meta name="twitter:title" content={t("home.meta.title")} />
        <meta name="twitter:description" content={t("home.meta.description")} />
        <meta name="twitter:image" content={`${site_url}/images/twitter-image.jpg`} />

        {/* JSON-LD Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": t("home.breadcrumb.home"),
                "item": site_url
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": t("home.breadcrumb.products"),
                "item": `${site_url}/products`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": t("home.breadcrumb.login"),
                "item": `${site_url}/authenticate`
              }
            ]
          })}
        </script>
      </Head>


      <div className={styles.home_container}>
        {/* Hero Section */}
        <motion.div className={styles.hero_section} viewport={{ once: true }}>

          <motion.section className={styles.hero_section_in1} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>

            <div className={styles.hero_text}>
              <div className={styles.hero_head}>

                <h1 className={styles.glow_text}>{t("home.hero.title")}</h1>
                <p className={styles.subtext}>{t("home.hero.subtitle")}</p>
              </div>


              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={styles.shop_btn} viewport={{ once: true }}>
                <Link href="/products">{t("home.shop_now")}</Link>
              </motion.div>
            </div>

          </motion.section>
          <motion.section className={styles.hero_section_in2} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          </motion.section>

        </motion.div>

        {/* Benefits Section */}
        <motion.section className={styles.benefits_section} viewport={{ once: true }}>

          {/* <h2 className={styles.home_h2}>{t("home.benefits.title")}</h2> */}

          <div className={styles.benefit_card_holder}>

            <div className={styles.benefit_card}>
              <Image src={"/images/plant.png"} width={200} height={200} alt="No Chemicals" />
              <span>{t("home.benefits.no_chemicals")}</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/nutrition.png"} width={200} height={200} alt="Rich in Nutrients" />
              <span>{t("home.benefits.nutrients")}</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/enviornment.png"} width={200} height={200} alt="Environment Friendly" />
              <span>{t("home.benefits.environment")}</span>
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/muscle.png"} width={200} height={200} alt="Better for Health" />
              <span>{t("home.benefits.health")}</span>
            </div>
          </div>

        </motion.section>


        {/* Trending Products Section */}
        <motion.section className={styles.trending_product} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>{t("home.products.best_selling")}</h2>
          <motion.section className={styles.trending_product} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
            {productsLoading ? (
              <>Loading</>
            ) : products.length === 0 ? (<></>) :
              (

                <Carousel>
                  {products.map((product, index) => (
                    <ProductCard product={product} />
                  ))}
                </Carousel>
              )
            }
          </motion.section>
        </motion.section>
        <motion.section className={styles.trending_product} viewport={{ once: true }}>
          <motion.section className={styles.trending_product} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
            {productsLoading ? (
              <>Loading</>
            ) : products.length === 0 ? (<></>) :
              (

                <Carousel>
                  {products.map((product, index) => (
                    <ProductCard product={product} />
                  ))}
                </Carousel>
              )
            }
          </motion.section>
        </motion.section>

        {/* Blogs Section */}
        <motion.section className={styles.blogs} viewport={{ once: true }}>
          <h2>Enchant Yourself</h2>
          {blogs.map((blog, index) => (
            <Blog key={blog.url} {...blog} />
          ))}

          <Link href={"/blogs"}>Load More</Link>
        </motion.section>



        {/* About Section */}
        <motion.section className={styles.about_section} viewport={{ once: true }}>
          <h2 className={styles.home_h2}>{t("home.about.title")}</h2>
          <div className={styles.about_in}>
            <motion.di viewport={{ once: true }} v
              initial={{ x: 0, y: 40, opacity: 0.3 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.5 }}
            >
              <Image src={"/images/rishi.png"} width={400} height={400} alt="Founder" />
            </motion.di>
            <motion.di viewport={{ once: true }} v
              initial={{ x: 0, y: 40, opacity: 0.3 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.5 }}
            >
              {/* <p>{t("home.about.description")}</p> */}
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque aliquam quidem voluptatibus vitae sequi in sunt nostrum nesciunt ad accusamus adipisci voluptates, omnis cupiditate, sint rem pariatur quasi aliquid enim consequatur rerum temporibus perferendis. Et natus itaque cupiditate dolore voluptas officiis, totam voluptate, ipsa laudantium fugiat fugit doloribus praesentium. Iste, aliquam iusto, tempore distinctio deserunt officia in cupiditate autem beatae quam ipsum, illum nobis? Odit sequi atque doloremque deserunt, cumque aspernatur perspiciatis provident, magni voluptatem eligendi recusandae ullam exercitationem id voluptatibus officiis! Rem maiores repudiandae ducimus dicta excepturi ratione praesentium asperiores minima aperiam, officia quae nostrum quas optio quis quidem!</p>
            </motion.di>

          </div>
          <div className={styles.custom_shape_divider_bottom_1743796481}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.shape_fill}></path>
            </svg>
          </div>
        </motion.section>



        {/* effectivenesss section */}

        <motion.section className={styles.effects} viewport={{ once: true }}>
          <Image src={"/images/effectiveness_image_1.jpg"} width={500} height={400} alt="Before using products" />
          <Image src={"/images/effectiveness_image_2.jpg"} width={500} height={400} alt="After using products" />
        </motion.section>



        {/* Reviews Section */}

        <motion.section className={styles.reviews_section} viewport={{ once: true }}>
          <motion.section initial={{ opacity: 0.5, x: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
            <h2 className={styles.home_h2}>{t("home.reviews.title")}</h2>
            <div className={styles.review_in}>

              <div className={styles.review_card}>
                <div>
                  <Image src={"/images/person1.jpg"} alt="Person face" width={200} height={200} />
                </div>
                <div className={styles.review_info}>
                  <section>
                    Himank Jain
                  </section>
                  <section><FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar /></section>
                  <section>
                    <p>Best Products.</p>
                  </section>
                </div>
              </div>
              <div className={styles.review_card}>
                <div>
                  <Image src={"/images/person1.jpg"} alt="Person face" width={200} height={200} />
                </div>
                <div className={styles.review_info}>
                  <section>
                    Himank Jain
                  </section>
                  <section><FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar /></section>
                  <section>
                    <p>Best Products.</p>
                  </section>
                </div>
              </div>


            </div>
          </motion.section>
        </motion.section>

        {/* services section */}

        <div className={styles.services}>
          <div className={styles.service_banner}>
            <h3>Customise your Product  <span><FaArrowRight /></span></h3>
            <Image src={"/images/ayurveda-utensils.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name  <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil_bottel_repat.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name  <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil_bottle_black.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
          <div className={styles.service_banner}>
            <h3>Service name  <span><FaArrowRight /></span></h3>
            <Image src={"/images/oil-banner.jpg"} alt="Services of organic robust" width={500} height={500} />
          </div>
        </div>

        {/* Subscription Section */}
        <motion.section className={styles.subscribe_section} viewport={{ once: true }}>
          <div className={styles.subscribe_bg}>
          </div>
          <motion.section initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className={styles.home_h2}>{t("home.subscribe.title")}</h2>
            <input type="email" placeholder={t("home.subscribe.placeholder")} />
            <button className={styles.subscribe_btn}>{t("home.subscribe.button")}</button>
          </motion.section>
        </motion.section>
      </div >
    </>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
