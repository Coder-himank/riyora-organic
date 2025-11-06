import styles from '@/styles/about.module.css';
import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  // Structured Data JSON-LD for WebPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Riyora Organic",
    "description": "Learn about Riyora Organic: Ayurvedic hair oils, natural hair care, and our commitment to chemical-free, herbal hair wellness.",
    "url": "https://riyoraorganic.com.app/about",
    "publisher": {
      "@type": "Organization",
      "name": "Riyora Organic",
      "logo": {
        "@type": "ImageObject",
        "url": "https://riyoraorganic.com.app/images/logo.png"
      }
    },
    "mainEntityOfPage": "https://riyoraorganic.com.app/about"
  };

  return (
    <>
      <Head>
        {/* Primary SEO Meta */}
        <title>About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care</title>
        <meta name="description" content="Learn about Riyora Organic: our Ayurvedic roots, pure herbal hair oils, and commitment to chemical-free, natural hair care for healthy, beautiful hair." />
        <meta name="keywords" content="Riyora Organic, Ayurvedic hair oil, natural hair care, herbal hair oil, chemical-free hair products, hair growth, scalp health, organic hair oil, Ayurveda, hair fall control, botanical hair care" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://riyoraorganic.com.app/about" />

        {/* Open Graph for Social Sharing */}
        <meta property="og:title" content="About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care" />
        <meta property="og:description" content="Discover Riyora Organic: Ayurvedic hair oils and natural hair care products. Explore our story, philosophy, and dedication to pure, effective herbal products." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riyoraorganic.com.app/about" />
        <meta property="og:image" content="https://riyoraorganic.com.app/images/ayurveda-utensils.jpg" />
        <meta property="og:site_name" content="Riyora Organic" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care" />
        <meta name="twitter:description" content="Explore Riyora Organic—Ayurvedic hair oils and natural hair care. Learn about our philosophy, story, and commitment to chemical-free, herbal products." />
        <meta name="twitter:image" content="https://riyoraorganic.com.app/images/ayurveda-utensils.jpg" />
        <meta name="twitter:site" content="@riyora-organic" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

      </Head>

      <main className={styles.container}>
        {/* About Riyora Section */}
        <section className={`${styles.aboutRiyora} ${styles.block_wrapper}`}>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Ayurvedic herbs and utensils used in Riyora Organic products"
              width={500}
              height={500}
              // loading="lazy"
              priority={true} // Preload main image for performance
            />
          </div>
          <div className={styles.text_content}>
            <h1>About <span>Riyora Organic</span></h1>
            <p>
              Welcome to <strong>Riyora Organic</strong>, your trusted source for <strong>Ayurvedic hair oil</strong> and <strong>natural hair care</strong>. Our journey started from a personal quest for pure, effective hair care, leading to crafting herbal oils rooted in <strong>Ayurvedic wisdom</strong> and modern research. Every bottle reflects our commitment to quality, safety, and transparency. Experience chemical-free, natural hair nourishment that restores health, shine, and strength.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className={`${styles.ourPhilosophy} ${styles.block_wrapper}`}>
          <div className={styles.text_content}>
            <h2>Our <span>Philosophy</span></h2>
            <p>
              At <strong>Riyora Organic</strong>, we believe true beauty begins with balance—between nature and nurture, tradition and science. We create clean, herbal formulations inspired by <strong>Ayurveda</strong> and validated by modern botanical research. Every product carries tradition, scientific rigor, and the purity of nature.
            </p>
          </div>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Ayurvedic principles reflected in Riyora Organic products"
              width={500}
              height={500}
              loading="lazy"
            />
          </div>
        </section>

        {/* Vision Section */}
        <section className={`${styles.ourVision} ${styles.block_wrapper}`}>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Our vision of natural and chemical-free hair care"
              width={500}
              height={500}
              loading="lazy"
            />
          </div>
          <div className={styles.text_content}>
            <h2>Our <span>Vision</span></h2>
            <p>
              We aim to empower individuals to embrace honest self-care through <strong>Ayurvedic wisdom</strong> and modern science. Our vision is a world where clean, herbal hair care becomes a daily ritual, free from toxic chemicals and false promises.
            </p>
          </div>
        </section>

        {/* Origin Story Section */}
        <section className={`${styles.howItStarted} ${styles.block_wrapper}`}>
          <div className={styles.text_content}>
            <h2>How <span>It All Started</span></h2>
            <p>Riyora Organic began as a personal quest to replace chemical-laden products with pure, effective hair oils.</p>
            <p>Facing hair fall and scalp issues, our founder and mother experimented with herbs, creating a homemade formula that restored health and strength naturally. This transformation became the foundation of Riyora Organic.</p>
            <p>Our early success led to sharing the oil with friends and family, and soon, demand sparked the birth of our brand.</p>
          </div>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Homemade herbal hair oil preparation"
              width={500}
              height={500}
              loading="lazy"
            />
          </div>
        </section>

        {/* Evolution Section */}
        <section className={`${styles.evolution} ${styles.block_wrapper}`}>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Evolution of Riyora Organic products"
              width={500}
              height={500}
              loading="lazy"
            />
          </div>
          <div className={styles.text_content}>
            <h2>The <span>Evolution of Riyora</span></h2>
            <p>Through rigorous research and consultation with Ayurvedic experts, our formula evolved to a professional-grade herbal hair oil. For years, we distributed it organically before officially launching Riyora Organic.</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={`${styles.ourMission} ${styles.block_wrapper}`}>
          <div className={styles.text_content}>
            <h2>Our <span>Mission</span></h2>
            <p>Riyora Organic is committed to sharing chemical-free, herbal hair wellness with everyone. Our mission extends beyond products—we promote a movement toward honest, natural self-care rooted in Ayurvedic wisdom.</p>
          </div>
          <div className={styles.image_wrapper}>
            <Image
              src="/images/ayurveda-utensils.jpg"
              alt="Riyora Organic mission for herbal hair care"
              width={500}
              height={500}
              loading="lazy"
            />
          </div>
        </section>
      </main>
    </>
  );
}
