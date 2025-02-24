
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import ProductCarousel from "@/components/ProductCarousel";
import Head from "next/head";


export default function Home() {
  const { t } = useTranslation("common");

  const products = [
    {
      image: "/products/indigo-powder.webp",
      name: "Indigo Powder",
      price: 90.43
    },
    {
      image: "/products/amla-powder.webp",
      name: "Amla Powder",
      price: 90.43
    },
    {
      image: "/products/multani-mitti.webp",
      name: "Multani Mitti",
      price: 90.43
    }
  ]

  return (<>

    <Head>
      <title>Learn And Buy Organic beauty Products</title>
      <meta name="description" content="Buy Organic products derived from ayurveda for rough and frizzy hairs, dry and oily skin, weak immune system." />
    </Head>
    <div className={styles.home_container}>

      {/* Hero Section */}

      <motion.div
        className={styles.hero_section}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div className={styles.hero_text}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >

          <h1 className={styles.glow_text}>{t("org_name")}</h1>
          <p className="subtext">Your best source for natural products.</p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={styles.shop_btn}
          >
            <Link href="/products">{t("shop_now")}</Link>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Benefits Section */}
      <motion.section
        className={styles.benefits_section}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}

      >
        <h2 className={styles.home_h2}>Why Choose Organic?</h2>
        <div className={styles.benefits_grid}>
          <div className={styles.benefit_card}>🌱 No Harmful Chemicals</div>
          <div className={styles.benefit_card}>🥑 Rich in Nutrients</div>
          <div className={styles.benefit_card}>🌍 Environmentally Friendly</div>
          <div className={styles.benefit_card}>💪 Better for Health</div>
        </div>
      </motion.section>

      <motion.section className={styles.about_section}>
        <h2 className={styles.home_h2}>About Organic Robust</h2>
        <p>Organic Robust Is a online business that sells organic products that improves healty lifestyle. This Company was started by A couple living in Udaipur Rajasthan. </p>
      </motion.section>

      {/* Trending Products Section */}
      <motion.section
        className={styles.traending_product}
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}

      >
        <h2 className={styles.home_h2}>Trending Products</h2>
        <ProductCarousel products={products} />


      </motion.section>

      {/* Reviews Section */}
      <motion.section
        className={styles.reviews_section}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}

      >
        <h2 className={styles.home_h2}>What Our Customers Say</h2>

        <section className={styles.review_cards}>

          <div className={styles.review_card}>
            <p> "Best organic products! Highly recommended!" - Emily R.</p>
          </div>
          <div className={styles.review_card}>
            <p>"Loved the freshness of the products!" - David P.</p>
          </div>
        </section>
      </motion.section>

      {/* Subscription Section */}
      <motion.section
        className={styles.subscribe_section}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}

      >
        <h2 className={styles.home_h2}>Get 10% Off on Your First Order!</h2>
        <input type="email" placeholder="Enter your email" />
        <button className={styles.subscribe_btn}>Subscribe</button>
      </motion.section>

    </div>
  </>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
