import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import Carousel from "@/components/Carousel";
import Head from "next/head";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { FaOilCan, FaRegClock } from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import ProductCard from "@/components/ProductCard";
import Blog from "@/components/blog";
import { useEffect, useState } from "react";
import BlogSkeleton from "@/components/BlogSkeleton";
import ProductSkeleton from "@/components/ProductSkeleton";
import StarRating from "@/components/StartRating";
import { FaUserMd, FaLeaf, FaSeedling, FaShieldAlt } from "react-icons/fa";
import { GiHairStrands } from "react-icons/gi";

import axios from "axios";
import getProductUrl from "@/utils/productsUtils";
import connectDB from "@/server/db";
import Product from "@/server/models/Product";

export const TrendingProduct = ({ products }) => {
  return;

  return (
    <motion.section
      className={styles.trending_product}
      viewport={{ once: true }}
    >
      <h2 className={styles.home_h2}>
        Our <span>Products</span>
      </h2>
      <motion.section
        className={styles.trending_product_in}
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {/* <Carousel> */}
        {!products ? (
          Array.from({ length: 2 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <>No Products</>
        ) : (
          products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        )}
        {/* </Carousel> */}
      </motion.section>
    </motion.section>
  );
};


export default function Home({ prouctsAvailable, highlightedProduct }) {
  const { locale } = useRouter(); // Get the current locale

  const [products, setProducts] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const [productUrl, setProductUrl] = useState(null);

  const choose_us_list_1 = [
    { img: "/images/choose_us_icon_1.png", text: "Cruelty Free" },
    { img: "/images/choose_us_icon_2.png", text: "Eco Friendly" },
    { img: "/images/choose_us_icon_3.png", text: "Non Sticky" },
    { img: "/images/choose_us_icon_4.png", text: "Vegan" },
    { img: "/images/choose_us_icon_5.png", text: "No Artificial Color" },
  ];
  const choose_us_list_2 = [
    { img: "/images/choose_us_icon_7.png", text: "With Plant Extract" },
    { img: "/images/choose_us_icon_6.png", text: "Gluten Free" },
    { img: "/images/choose_us_icon_8.png", text: "Dermatology tested" },
    { img: "/images/choose_us_icon_9.png", text: "Chemical Free" },
    { img: "/images/choose_us_icon_10.png", text: "Mineral Oil Free" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts"); // Replace with your API endpoint
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/getblogs");
        setBlogs(res.data); // Axios automatically parses JSON
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setBlogsLoading(false);
      }
    };

    const fetchProductUrl = async () => {
      const url = await getProductUrl();
      setProductUrl(url);
    };

    fetchBlogs();
    fetchProducts();
    fetchProductUrl();
  }, []);
  const { publicRuntimeConfig } = getConfig();
  const site_url = publicRuntimeConfig.BASE_URL;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Riyora Organic | Ayurvedic Hair Oil for Healthy Hair Growth
        </title>
        <meta
          name="description"
          content="Riyora Organic offers premium ayurvedic hair oil for strong, healthy, and shiny hair. 100% natural, cruelty-free, and eco-friendly hair care products. Shop now for the best hair oil in India."
        />
        <meta
          name="keywords"
          content="Riyora, ayurvedic hair oil, organic hair oil, hair growth oil, natural hair care, cruelty-free, eco-friendly, vegan hair oil, best hair oil India"
        />
        <meta name="author" content="Riyora Organic" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <link rel="canonical" href="https://riyora-organic.vercel.app/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riyora-organic.vercel.app/" />
        <meta
          property="og:title"
          content="Riyora Organic | Ayurvedic Hair Oil for Healthy Hair Growth"
        />
        <meta
          property="og:description"
          content="Discover Riyora Organic's ayurvedic hair oil, crafted for stronger, healthier hair. 100% natural, vegan, and cruelty-free. Shop now!"
        />
        <meta
          property="og:image"
          content="https://riyora-organic.vercel.app/images/og-image.jpg"
        />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Riyora Organic" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://riyora-organic.vercel.app/" />
        <meta
          name="twitter:title"
          content="Riyora Organic | Ayurvedic Hair Oil for Healthy Hair Growth"
        />
        <meta
          name="twitter:description"
          content="Shop Riyora Organic's ayurvedic hair oil for natural hair growth and shine. 100% organic, cruelty-free, and eco-friendly."
        />
        <meta
          name="twitter:image"
          content="https://riyora-organic.vercel.app/images/twitter-image.jpg"
        />

        {/* JSON-LD Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://riyora-organic.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: "https://riyora-organic.vercel.app/products",
              },
            ],
          })}
        </script>
      </Head>

      <div className="navHolder"></div>
      <div className={styles.home_container}>
        {/* Hero Section */}
        <motion.div className={styles.hero_section} viewport={{ once: true }}>
          <motion.section
            className={styles.hero_section_in1}
            initial={{ opacity: 0.7, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Carousel>
              <div
                className={`${styles.hero_section_slides} ${styles.hero_section_slide_1}`}
              >
                <Link
                  href={"/products/" + (highlightedProduct.slug || "")}
                >
                  <Image
                    src={"/images/banner1.png"}
                    width={1920}
                    height={500}
                    alt="Riyora Organic Ayurvedic Hair Oil Banner"
                    priority
                  />
                </Link>
              </div>
              <div
                className={`${styles.hero_section_slides} ${styles.hero_section_slide_2}`}
              >
                <Image
                  src={"/images/banner1.png"}
                  width={1920}
                  height={500}
                  alt="Natural Hair Oil for Hair Growth"
                />
              </div>
            </Carousel>
          </motion.section>
        </motion.div>

        {/* Trending Products Section */}
        <TrendingProduct products={products} />

        <motion.section className={styles.product_section}>
          <div className={styles.section_header}>
            <h2>Shop Now</h2>
          </div>
          <section className={styles.product_section_in}>
            <div className={styles.product_image_wrapper}>
              {/* <div className={styles.bg_circel}></div> */}
              <Carousel
                showControls={false}
              >
                {highlightedProduct.imageUrl.map((img, index) => (

                  <Image
                    src={img || "/products/root_strength_hair_oil_2.png"}
                    width={1000}
                    height={1000}
                    alt={highlightedProduct.name || "Riyora Root Strength Hair Oil Bottle"}
                  />
                ))}
              </Carousel>
            </div>
            <div className={styles.product_text_content}>
              <h1>{highlightedProduct.name}</h1>
              <Link href={`/products/${highlightedProduct.slug}#reviews`} style={{ maxWidth: "fit-content" }}>
                <section className={styles.product_rating}>
                  <StarRating rating={highlightedProduct.averageRating} />{" "}
                  <span className={styles.review_count}>{highlightedProduct.averageRating} ({highlightedProduct.numReviews})</span>
                </section>
              </Link>
              <Link href={prouctsAvailable > 1 ? "/products" : "/products/" + highlightedProduct.slug}>
                <p> {highlightedProduct.description.length > 250 ? highlightedProduct.description.slice(0, 250) + "..." + " learn more" : highlightedProduct.description ||
                  "Experience the power of Ayurveda with Riyora's Root Strength Hair Oil. Formulated with natural plant extracts, this oilnourishes your scalp, strengthens roots, and promotes healthyhair growth. Free from parabens, sulfates, and artificialcolors."}
                </p>
              </ Link>
              <div className={styles.product_bottom}>

                <Link href={prouctsAvailable > 1 ? "/products" : "/products/" + highlightedProduct.slug} className={styles.product_shop_btn}>
                  Shop Now for ₹ {highlightedProduct.price}
                </Link>

                {highlightedProduct.discountPercentage && (
                  <>
                    <span className={styles.product_discount}>
                      {highlightedProduct.discountPercentage}% Off
                    </span>
                    <p>MRP: {highlightedProduct.mrp}</p>
                  </>
                )}

              </div>
            </div>

          </section>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section className={styles.choose_us_section}>
          <div className={styles.section_header}>
            <h2>
              Why <span>Choose Riyora?</span>
            </h2>
          </div>
          <section className={styles.choose_us_section_in}>
            <div className={styles.choose_us_text_content}>
              <ul>
                <li>Powered by Potent Ingredients Enriched with Saw Palmetto, Rosemary, Bhringraj, Jojoba, and Cold-Pressed Coconut Oil for strong and healthy roots.</li>
                <li>Free from mineral oil, palm oil, parabens, sulfates, silicones, and synthetic fragrances — only pure, natural care.</li>
                <li>Clinically and dermatologically tested to ensure unmatched purity, safety, and visible performance.</li>
                <li>Crafted with complete transparency — every ingredient is honestly listed and purposefully chosen.</li>
                <li>Enriched with potent Ayurvedic herbs and cold-pressed oils for deep nourishment and scalp rejuvenation.</li>
              </ul>
            </div>
            <div className={styles.choose_us_image_wrapper}>
              <section className={styles.choose_us_image_row}>
                {choose_us_list_1.map((choose_us, index) => (
                  <motion.div
                    key={index}
                    className={styles.choose_us_card}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className={styles.choose_us_card_icon}>
                      <Image
                        src={choose_us.img}
                        width={50}
                        height={50}
                        alt={choose_us.text}
                      />
                    </div>
                    <span>{choose_us.text}</span>
                  </motion.div>
                ))}
              </section>
              <section className={styles.choose_us_image_row}>
                {choose_us_list_2.map((choose_us, index) => (
                  <motion.div
                    key={index}
                    className={styles.choose_us_card}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className={styles.choose_us_card_icon}>
                      <Image
                        src={choose_us.img}
                        width={50}
                        height={50}
                        alt={choose_us.text}
                      />
                    </div>
                    <span>{choose_us.text}</span>
                  </motion.div>
                ))}
              </section>
            </div>
          </section>
        </motion.section>

        {/* About Section */}
        <motion.section
          className={styles.about_section}
          initial={{ x: 0, y: 0, opacity: 0.8 }}
          whileInView={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.5 }}
          viewport={{ once: true }}
        >
          <div className={styles.about_in}>
            <motion.div className={styles.about_image}>
              <div className={styles.about_img_1}>
                <Image
                  src={"/Riyora-Logo-Favicon.png"}
                  alt="Riyora Organic Logo"
                  width={500}
                  height={500}
                />
              </div>
              <div className={styles.about_img_2}>
                <Image
                  src={"/Riyora-Logo-Favicon.png"}
                  alt="Riyora Organic Logo"
                  width={500}
                  height={500}
                />
              </div>
            </motion.div>
            <motion.div className={styles.about_text}>
              <div className={styles.about_text_in}>
                <h3>About Riyora Organic</h3>
                <p>
                  Riyora Organic is dedicated to reviving the ancient wisdom of
                  Ayurveda for modern hair care. Our mission is to provide pure,
                  effective, and sustainable hair oil solutions that nurture
                  your hair naturally. Join thousands who trust Riyora for their
                  hair transformation journey.
                </p>
                <Link href={"/about"}>Learn More</Link>
              </div>
              <motion.div className={styles.about_achivements}>
                <motion.div>
                  <span className={styles.about_achivements_icon}>
                    <FaUserMd />
                  </span>
                  <span>Dermatologist Tested</span>
                </motion.div>
                <motion.div>
                  <span className={styles.about_achivements_icon}>
                    <GiHairStrands />
                  </span>
                  <span>Suitable For All Hair Types</span>
                </motion.div>
                <motion.div>
                  <span className={styles.about_achivements_icon}>
                    <FaLeaf />
                  </span>
                  <span>Promotes Hair Growth</span>
                </motion.div>
                <motion.div>
                  <span className={styles.about_achivements_icon}>
                    <FaShieldAlt />
                  </span>
                  <span>Reduces Hair Fall</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Blogs Section */}
        <motion.section className={styles.blogs} viewport={{ once: true }}>
          <div className={styles.section_header}>
            <h2 className={styles.home_h2}>
              Hair Care <span>Insights</span>
            </h2>
            <p className={styles.sub_heading}>
              Explore expert tips, ayurvedic secrets, and customer stories for
              healthy, beautiful hair with Riyora Organic.
            </p>
          </div>
          {!blogs ? (
            <section className={styles.blog_in}>
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogSkeleton
                  key={index}
                  style={
                    index % 2 === 0
                      ? { flexDirection: "row-reverse" }
                      : { flexDirection: "row" }
                  }
                />
              ))}
            </section>
          ) : (
            <section className={styles.blog_in}>
              {blogs.map((blog, index) => (
                <Blog
                  key={index}
                  {...blog}
                  showContent={false}
                  flexDirection={index % 2 === 0 ? "row-reverse" : "row"}
                />
              ))}
            </section>
          )}
          <Link href={"/blogs"} className={styles.load_btn}>
            Read More Hair Care Tips
          </Link>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section className={styles.effects} viewport={{ once: true }}>
          <div className={styles.section_header}>
            <h2 className={styles.home_h2}>
              Customer <span>Stories</span>
            </h2>
            <p className={styles.sub_heading}>
              Hear from our loyal customers who have experienced the Riyora
              difference.
            </p>
          </div>
          <Carousel>
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.section className={styles.testimony_section} key={index}>
                <div className={styles.testimony_image_wrapper}>
                  <Image
                    src={"/images/person1.png"}
                    alt={"Happy Riyora Customer"}
                    height={450}
                    width={450}
                  />
                </div>
                <div className={styles.testimony_text_content}>
                  <h3>Thank You Riyora</h3>
                  <p>
                    Trisha shares her journey with Riyora's Root Strength Hair
                    Oil. After 2 months of use, she noticed stronger, shinier
                    hair and reduced hair fall. Join the Riyora family for
                    visible results!
                  </p>
                  <section className={styles.testimony_rating}>
                    <StarRating rating={4.7} />
                  </section>
                </div>
              </motion.section>
            ))}
          </Carousel>
        </motion.section>

        {/* Trending Products Section (again for SEO and engagement) */}
        <TrendingProduct products={products} />
      </div >
    </>
  );
}


export const getStaticProps = async ({ params }) => {
  try {

    await connectDB()
    const highlightedProduct = await Product.find({});

    return {
      props: {
        prouctsAvailable: 0,//highlightedProduct.length,
        highlightedProduct: JSON.parse(JSON.stringify(highlightedProduct[0]))
      }
    }

  } catch (e) {
    console.log("Cant fetch Product")
  }
  return {
    props: {
      highlightedProduct: JSON.parse(JSON.stringify({
        name: "Loading",
        price: 0,
        mrp: 0,
      }))
    }
  }
}