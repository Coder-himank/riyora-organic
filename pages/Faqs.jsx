import React, { useState } from "react";
import styles from "@/styles/faqs.module.css";
import Head from "next/head";
import Image from "next/image";
const faqs = [
  {
    question: "Is this hair oil suitable for all genders?",
    answer:
      "Yes, Riyora Hair Oil is unisex and works well for men, women, and teens above 13.",
  },
  {
    question: "How often should I use it?",
    answer:
      "Use 3-4 times a week for best visible results. It can be used as overnight oil or few hours before washing and wash it with mild shampoo.",
  },
  {
    question: "Will it leave my hair sticky or greasy?",
    answer:
      "No. The Hair & Scalp Nourishment Oil (Coconut-based) is lightweight, while the Hair & Scalp Strengthening Oil (Sesame-based) is rich yet non-greasy. Both absorb quickly into the scalp and hair without leaving any sticky or oily residue.",
  },
  {
    question: "Can I use it after hair smoothing or coloring?",
    answer:
      "Yes, it is safe for chemically treated hair. The herbal blend helps maintain strength and softness.",
  },
  {
    question: "Is there any artificial fragrance or color?",
    answer:
      "No. Only natural Herbs & essential oils are used for fragrance. No added colors.",
  },
  {
    question: "How is this different from regular hair oils?",
    answer:
      "Riyora oil is infused with 30 herbs, cold-pressed oils, and high-performance essential oils — inspired by Ayurveda, backed by modern quality.",
  },
  {
    question: "Can it help with hair fall or thin hair?",
    answer:
      "It’s designed to support scalp health and root strength. Regular use helps reduce visible signs of hair stress.",
  },
  {
    question: "What’s the shelf life?",
    answer:
      "24 months when unopened. Once opened, it is best used within 3–4 months for optimal results.",
  },
  {
    question: "Is it tested for safety?",
    answer:
      "Yes. Our oils are made in FDA & GMP-certified units and Dermatologist and lab-tested, safe ingredients.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <section
        className={styles.question}
        onClick={() => setOpen((prev) => !prev)}
      >
        Q: {question}
      </section>
      {open && (
        <section className={styles.answer}>
          <p>A: {answer}</p>
        </section>
      )}
    </div>
  );
}

const Faqs = () => {
  const [searchText, setSearchText] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>
          Riyora Hair Oil FAQs | Natural Hair Care Questions Answered
        </title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Riyora Hair Oil. Learn about ingredients, usage, safety, and benefits of our natural, Ayurvedic hair oil for all genders."
        />
        <meta
          name="keywords"
          content="Riyora, Hair Oil, FAQs, Natural Hair Oil, Ayurvedic, Unisex, Hair Care, Herbal Oil, Hair Fall, Hair Growth, Organic, Safe, Ingredients"
        />
        <meta property="og:title" content="Riyora Hair Oil FAQs" />
        <meta
          property="og:description"
          content="Get all your questions answered about Riyora's natural, herbal hair oil. Suitable for all genders and hair types."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://riyora-organic.vercel.app/faqs"
        />
        <meta
          property="og:image"
          content="https://riyora-organic.vercel.app/og-image.jpg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>Riyora Hair Oil FAQs</h1>

        <section className={styles.search_box}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search FAQs about Riyora Hair Oil..."
            className={styles.searchInput}
            aria-label="Search FAQs"
          />
        </section>
        <div className={styles.faqItems}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <FaqItem key={idx} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <p className={styles.noResults}>No FAQs match your search.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Faqs;
