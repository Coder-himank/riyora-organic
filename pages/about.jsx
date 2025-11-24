import styles from '@/styles/about.module.css';
import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Riyora Organic",
    "description": "Learn about Riyora Organic: Ayurvedic hair oils, natural hair care, and our commitment to chemical-free, herbal hair wellness.",
    "url": "https://riyoraorganic.com/about",
    "publisher": {
      "@type": "Organization",
      "name": "Riyora Organic",
      "logo": {
        "@type": "ImageObject",
        "url": "https://riyoraorganic.com/images/logo.png"
      }
    },
    "mainEntityOfPage": "https://riyoraorganic.com/about"
  };

  const sections = [
    {
      title: "About Riyora Organic",
      text: "Welcome to Riyora Organic, your trusted source for Ayurvedic hair oil and natural hair care. Our journey started from a personal quest for pure, effective hair care, leading to crafting herbal oils rooted in Ayurvedic wisdom and modern research. Every bottle reflects our commitment to quality, safety, and transparency. Experience chemical-free, natural hair nourishment that restores health, shine, and strength.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: false
    },
    {
      title: "Our Philosophy",
      text: "At Riyora Organic, we believe true beauty begins with balance—between nature and nurture, tradition and science. We create clean, herbal formulations inspired by Ayurveda and validated by modern botanical research. Every product carries tradition, scientific rigor, and the purity of nature.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: true
    },
    {
      title: "Our Vision",
      text: "We aim to empower individuals to embrace honest self-care through Ayurvedic wisdom and modern science. Our vision is a world where clean, herbal hair care becomes a daily ritual, free from toxic chemicals and false promises.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: false
    },
    {
      title: "How It All Started",
      text: "Riyora Organic began as a personal quest to replace chemical-laden products with pure, effective hair oils. Facing hair fall and scalp issues, our founder experimented with herbs, creating a homemade formula that restored health and strength naturally. Our early success led to sharing the oil with friends and family, sparking the birth of our brand.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: true
    },
    {
      title: "The Evolution of Riyora",
      text: "Through rigorous research and consultation with Ayurvedic experts, our formula evolved to a professional-grade herbal hair oil. For years, we distributed it organically before officially launching Riyora Organic.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: false
    },
    {
      title: "Our Mission",
      text: "Riyora Organic is committed to sharing chemical-free, herbal hair wellness with everyone. Our mission extends beyond products—we promote a movement toward honest, natural self-care rooted in Ayurvedic wisdom.",
      img: "/images/ayurveda-utensils.jpg",
      reverse: true
    }
  ];

  return (
    <>
      <Head>
        <title>About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care</title>
        <meta name="description" content="Learn about Riyora Organic: our Ayurvedic roots, pure herbal hair oils, and commitment to chemical-free, natural hair care for healthy, beautiful hair." />
        <link rel="canonical" href="https://riyoraorganic.com.app/about" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className={styles.container}>
        <h1>About Riyora Orgnaic</h1>
        {sections.map((section, index) => (
          <section
            key={index}
            className={`${styles.section} ${section.reverse ? styles.reverse : ""}`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={section.img}
                alt={section.title}
                width={600}
                height={400}
                className={styles.image}
              />
            </div>
            <div className={styles.textContent}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
