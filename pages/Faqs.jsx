import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/faqs.module.css";
import Image from "next/image";

const faqsData = [
  {
    question: "Is this hair oil suitable for all genders?",
    answer:
      "Yes, Riyora Hair Oil is unisex and works well for men, women, and teens above 13.",
  },
  {
    question: "How often should I use it?",
    answer:
      "Use 3-4 times a week for best visible results. It can be used overnight or a few hours before washing, then wash with a mild shampoo.",
  },
  {
    question: "Will it leave my hair sticky or greasy?",
    answer:
      "No. The Coconut-based oil is lightweight, while the Sesame-based oil is rich but non-greasy. Both absorb quickly without residue.",
  },
  {
    question: "Can I use it after hair smoothing or coloring?",
    answer:
      "Yes, safe for chemically treated hair. The herbal blend maintains strength and softness.",
  },
  {
    question: "Is there any artificial fragrance or color?",
    answer:
      "No. Only natural herbs & essential oils are used. No added colors.",
  },
  {
    question: "How is this different from regular hair oils?",
    answer:
      "Riyora oil is infused with 30 herbs, cold-pressed oils, and high-performance essential oils — Ayurvedic-inspired, modern quality.",
  },
  {
    question: "Can it help with hair fall or thin hair?",
    answer:
      "Designed to support scalp health and root strength. Regular use helps reduce visible signs of hair stress.",
  },
  {
    question: "What’s the shelf life?",
    answer:
      "24 months unopened. Once opened, use within 3–4 months for optimal results.",
  },
  {
    question: "Is it tested for safety?",
    answer:
      "Yes. Made in FDA & GMP-certified units and dermatologist-tested, safe ingredients.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={styles.faqItem}>
      <button
        className={styles.question}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={question.replace(/\s+/g, "-")}
      >
        Q: {question}
      </button>
      {open && (
        <section
          id={question.replace(/\s+/g, "-")}
          className={styles.answer}
        >
          <p>A: {answer}</p>
        </section>
      )}
    </article>
  );
}

export default function Faqs({ dynamicFaqs = [] }) {
  const [searchText, setSearchText] = useState("");
  const allFaqs = [...faqsData, ...dynamicFaqs]; // Merge static + dynamic FAQs

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Head>
        {/* --- Primary SEO --- */}
        <title>Riyora Hair Oil FAQs | Natural Hair Care Questions Answered</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Riyora Hair Oil. Learn about ingredients, usage, safety, and benefits of our natural, Ayurvedic hair oil for all genders."
        />
        <meta
          name="keywords"
          content="Riyora, Hair Oil, FAQs, Natural Hair Oil, Ayurvedic, Unisex, Hair Care, Herbal Oil, Hair Fall, Hair Growth, Organic, Safe, Ingredients"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://riyoraorganic.com/faqs" />

        {/* --- Open Graph / Social Sharing --- */}
        <meta property="og:title" content="Riyora Hair Oil FAQs" />
        <meta
          property="og:description"
          content="Get all your questions answered about Riyora's natural, herbal hair oil. Suitable for all genders and hair types."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://riyoraorganic.com/faqs"
        />
        <meta
          property="og:image"
          content="https://riyoraorganic.com/images/faqs-og.jpg"
        />
        <meta property="og:site_name" content="Riyora Organic" />

        {/* --- Twitter Card --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Riyora Hair Oil FAQs" />
        <meta
          name="twitter:description"
          content="Find answers about Riyora Hair Oil usage, ingredients, and safety. Ayurvedic, natural, and effective hair care solutions."
        />
        <meta
          name="twitter:image"
          content="https://riyoraorganic.com/images/faqs-og.jpg"
        />
        <meta name="twitter:site" content="@riyora_organic" />

        {/* --- Structured Data --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: allFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      </Head>

      <main className={styles.container}>
        <h1>Riyora Hair Oil FAQs</h1>

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

        <section className={styles.faqItems}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <FaqItem key={idx} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <p className={styles.noResults}>No FAQs match your search.</p>
          )}
        </section>
      </main>
    </>
  );
}
