import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import Carousel from "@/components/Carousel";
import Head from "next/head";

export default function Home() {
  const { t } = useTranslation("common");

  const products = [
    {
      theme: "#164c3e",
      image: "/products/indigo-powder.png",
      name: t("home.product.indigo"),
      price: 90.43
    },
    {
      theme: "#a1b512",
      image: "/products/amla-powder.png",
      name: t("home.product.amla"),
      price: 90.43
    },
    {
      theme: "#f0c08c",
      image: "/products/multani-mitti.png",
      name: t("home.product.multani"),
      price: 90.43
    }
  ];

  return (
    <>
      <Head>
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description")} />
      </Head>

      <div className={styles.home_container}>
        {/* Hero Section */}
        <motion.div className={styles.hero_section} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <motion.div className={styles.hero_text} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <h1 className={styles.glow_text}>{t("home.org_name")}</h1>
            <p className="subtext">{t("home.hero.subtitle")}</p>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={styles.shop_btn}>
              <Link href="/products">{t("home.shop_now")}</Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.section className={styles.benefits_section} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <h2 className={styles.home_h2}>{t("home.benefits.title")}</h2>
          <Carousel>
            <div className={styles.benefit_card}>
              <Image src={"/images/plant.png"} width={200} height={200} alt="No Chemicals" />
              {t("home.benefits.no_chemicals")}
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/nutrition.png"} width={200} height={200} alt="Rich in Nutrients" />
              {t("home.benefits.nutrients")}
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/enviornment.png"} width={200} height={200} alt="Environment Friendly" />
              {t("home.benefits.environment")}
            </div>
            <div className={styles.benefit_card}>
              <Image src={"/images/muscle.png"} width={200} height={200} alt="Better for Health" />
              {t("home.benefits.health")}
            </div>
          </Carousel>
        </motion.section>

        {/* About Section */}
        <motion.section className={styles.about_section} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1.8, delay: 0.3 }}>
          <h2 className={styles.home_h2}>{t("home.about.title")}</h2>
          <div className={styles.about_in}>
            <Image src={"/images/rishi.png"} width={400} height={400} alt="Founder" />
            <p>{t("home.about.description")}</p>
          </div>
        </motion.section>

        {/* Trending Products Section */}
        <motion.section className={styles.trending_product} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <h2 className={styles.home_h2}>{t("home.products.best_selling")}</h2>
          <Carousel>
            {products.map((product, index) => (
              <div key={index} className={styles.productCard}>
                <Image src={product.image} alt={product.name} width={300} height={300} style={{ background: product.theme }} />
                <section className={styles.product_info}>
                  <h3>{product.name}</h3>
                  <Link href={`/products`}>{t("home.read_more")}</Link>
                </section>
              </div>
            ))}
          </Carousel>
        </motion.section>

        {/* Reviews Section */}
        <motion.section className={styles.reviews_section} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <h2 className={styles.home_h2}>{t("home.reviews.title")}</h2>
          <Carousel>
            <div className={styles.review_card}>
              <p>{t("home.reviews.review1")}</p>
            </div>
            <div className={styles.review_card}>
              <p>{t("home.reviews.review2")}</p>
            </div>
          </Carousel>
        </motion.section>

        {/* Subscription Section */}
        <motion.section className={styles.subscribe_section} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <h2 className={styles.home_h2}>{t("home.subscribe.title")}</h2>
          <input type="email" placeholder={t("home.subscribe.placeholder")} />
          <button className={styles.subscribe_btn}>{t("home.subscribe.button")}</button>
        </motion.section>
      </div>
    </>
  );
}

// i18n Support
export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
