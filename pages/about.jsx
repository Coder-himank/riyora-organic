import styles from '@/styles/about.module.css';
import Head from 'next/head';
import Image from 'next/image';
export default function About() {
  return (
    <>
      <Head>
        <title>About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care</title>
        <meta name="description" content="Learn about Riyora Organic: our Ayurvedic roots, pure herbal hair oils, and commitment to natural, chemical-free hair care. Discover our story, philosophy, and mission for healthy, beautiful hair." />

        <meta property="og:title" content="About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care" />
        <meta property="og:description" content="Explore the journey of Riyora Organic—where tradition meets science for natural hair care. Discover our Ayurvedic philosophy, pure ingredients, and dedication to honest, effective beauty." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riyora-organic.vercel.app/about" />
        <meta property="og:image" content="https://riyora-organic.vercel.app/images/ayurveda-utensils.jpg" />
        <meta property="og:site_name" content="Riyora Organic" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Riyora Organic | Ayurvedic Hair Oil & Natural Hair Care" />
        <meta name="twitter:description" content="Discover Riyora Organic—Ayurvedic hair oils and natural hair care. Learn about our story, philosophy, and commitment to pure, effective herbal products." />
        <meta name="twitter:image" content="https://riyora-organic.vercel.app/images/ayurveda-utensils.jpg" />
        <meta name="twitter:site" content="@riyora-organic.vercel.app" />

        <meta name="keywords" content="Riyora Organic, About Riyora, Ayurvedic hair oil, natural hair care, herbal hair oil, chemical-free hair products, hair growth, hair wellness, organic hair oil, pure ingredients, Ayurveda, hair loss solution, scalp health, Indian hair oil, botanical hair care, sustainable beauty, clean beauty, non-toxic hair oil, hair nourishment, hair strengthening, hair fall control" />
        <meta name="author" content="Riyora Organic" />
        <link rel="canonical" href="https://riyora-organic.vercel.app/about" />
      </Head>
      <div className={styles.container}>
        <section className={`${styles.aboutRiyora} ${styles.block_wrapper}`}>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="Riyora Organic - About Us - Ayurvedic Hair Oil" width={500} height={500} loading="lazy" />
          </div>
          <div className={styles.text_content}>
            <h1>About <span>Riyora Organic</span></h1>
            <p>
              Welcome to <strong>Riyora Organic</strong>, your trusted source for <strong>Ayurvedic hair oil</strong> and <strong>natural hair care</strong> solutions. Our journey began with a personal quest for pure, effective hair care, leading us to craft herbal oils rooted in <strong>Ayurvedic wisdom</strong> and modern research. We believe in honest, chemical-free self-care, using only the finest botanicals to nourish and restore hair health. Each bottle is a testament to our commitment to quality, safety, and transparency. At Riyora, we empower you to embrace your natural beauty with products that are gentle, effective, and trustworthy. Join us as we redefine hair care, one drop at a time, and experience the difference of nature's purest ingredients.
            </p>
          </div>
        </section>
        <section className={`${styles.ourPhilosophy} ${styles.block_wrapper}`}>
          <div className={styles.text_content}>
            <h2>Our <span>Philosophy</span></h2>
            <p>
              At <strong>Riyora Organic</strong>, we believe that true beauty starts with balance—between nature and nurture, tradition and science, care and consistency. In an age of synthetic shortcuts and chemical overload, we’re returning to the roots of health wellness with clean, powerful formulations inspired by <strong>Ayurveda</strong> and modern botanical research. Every bottle we create carries the essence of tradition, the rigour of science, and the purity of nature.
            </p>
          </div>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="Ayurvedic Philosophy - Riyora Organic" width={500} height={500} loading="lazy" />
          </div>
        </section>

        <section className={`${styles.block_wrapper} ${styles.ourVision}`}>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="Our Vision - Riyora Organic" width={500} height={500} loading="lazy" />
          </div>
          <div className={styles.text_content}>
            <h2>Our <span>Vision</span></h2>
            <p>
              To empower individuals to embrace natural, effective, and honest self-care through time-tested <strong>Ayurvedic wisdom</strong> and modern science. Riyora Organic envisions a world where clean, herbal care becomes a daily ritual—free from toxic chemicals, gimmicks, and false promises. We aim to restore trust in ancient plant-powered solutions while ensuring modern quality, elegance, and consistency.
            </p>
          </div>
        </section>

        <section className={`${styles.block_wrapper} ${styles.howItStarted}`}>
          <div className={styles.text_content}>
            <h2>How <span>It All Started</span></h2>
            <p>
              Riyora's journey began not as a brand, but as a need—a need to replace harmful, chemical-laced products with something pure, honest, and truly effective.
            </p>
            <p>
              While working in an industrial area, I experienced constant hair fall, dandruff, and extreme dryness. My hair became stiff and lifeless, and my scalp felt itchy and sensitive. Around the same time, my mother also struggled with hair issues. Despite using many well-known products, there was no real improvement. Eventually, we consulted a doctor, and some improvement began to show in her hair growth.
            </p>
            <p>
              But then something unexpected happened. She applied the same Henna (Mehendi) she had trusted and used for over 25 years—and suddenly experienced a severe allergic reaction. Her scalp broke out in painful rashes, her eyes turned red, and tiny blisters appeared. Monthly medical expenses kept rising, but the problem didn’t go away. The question kept haunting us: How can a product she trusted for decades suddenly cause harm?
            </p>
            <p>
              That's when we realized the bitter truth: adulteration.
            </p>
            <p>
              Determined to find a safe alternative, my mother began collecting herbs at home and preparing her own homemade hair oil using traditional methods. She used it consistently for a few months—and gradually, her hair fall reduced, and her scalp felt calmer.
            </p>
            <p>
              One day, she gave that same oil to me. I used it with no expectations. But within a few months, even I noticed the change—my hair started feeling softer, smoother, and healthier than it had in years. After seeing the visible improvement in my hair, even our relatives started asking for the oil.
            </p>
            <p>
              One day, while my mom and I were making a fresh batch, my father jokingly said, “You should start a business with this.” This personal transformation became our inspiration.
            </p>
          </div>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="How Riyora Started - Herbal Hair Oil" width={500} height={500} loading="lazy" />
          </div>
        </section>

        <section className={`${styles.block_wrapper} ${styles.evolution}`}>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="Evolution of Riyora Organic" width={500} height={500} loading="lazy" />
          </div>
          <div className={styles.text_content}>
            <h2>The <span>Evolution of Riyora</span></h2>
            <p>
              We started researching more about herbal remedies and Ayurvedic practices. We consulted Ayurvedic doctors and refined the formula step-by-step. Over the next two years, we gave samples to friends and women in our community—and they too experienced visible improvements. Encouraged by their feedback, we worked with a professional formulator to standardize the process and ensure purity and safety.
            </p>
            <p>
              At first, we didn't even think of selling—we were just giving it to help others. But when people started coming back and asking to buy it, we realized: this works. Though we never made medical claims, these genuine results gave us confidence. We knew we were onto something that truly worked—safely, naturally, and honestly.
            </p>
            <p>
              For two years, we sold the oil without any branding—purely through word of mouth. And when the demand kept growing, we realized this was more than just a homemade remedy.
            </p>
          </div>
        </section>

        <section className={`${styles.block_wrapper} ${styles.ourMission}`}>
          <div className={styles.text_content}>
            <h2>Our <span>Mission</span></h2>
            <p>
              That was the moment <strong>Riyora Organic</strong> was born. Our mission is not just to sell a product, but to share a movement against toxic chemicals and harmful products. We are committed to providing <strong>pure, effective, and safe Ayurvedic hair oils</strong> for everyone seeking natural hair wellness.
            </p>
          </div>
          <div className={styles.image_wrapper}>
            <Image src="/images/ayurveda-utensils.jpg" alt="Our Mission - Riyora Organic" width={500} height={500} loading="lazy" />
          </div>
        </section>
      </div>
    </>
  );
}
