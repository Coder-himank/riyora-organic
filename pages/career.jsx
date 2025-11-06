// pages/career.jsx
import styles from "@/styles/career.module.css";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

/**
 * Careers page — SEO optimized inline (no separate SEO component)
 * - One <h1> for page, <h2> for individual jobs (correct heading hierarchy)
 * - Meta tags: title, description, keywords, robots, canonical
 * - Open Graph + Twitter tags for sharing
 * - JSON-LD structured data: WebSite, Organization, and JobPosting entries
 * - Semantic HTML, accessible aria attributes, next/image usage
 */

export const career = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riyoraorganic.com";
  const pageUrl = `${siteUrl}/career`;

  const title = "Careers at Riyora Organic — Join Our Natural Hair Oil Team";
  const description =
    "Find careers and influencer partnership opportunities at Riyora Organic. Join our team to promote premium natural hair oils, wellness and sustainable beauty.";
  const keywords =
    "Riyora Organic careers, hair oil jobs, influencer partnership, natural hair care jobs, organic beauty careers";

  // Use absolute URLs for social image previews
  const ogImage = `${siteUrl}/images/join_us_career.png`;
  const influencerImage = `${siteUrl}/images/influential_partnership.png`;

  // JSON-LD structured data: WebPage + Organization + JobPosting entries
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "url": pageUrl,
      "description": description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Riyora Organic",
      "url": siteUrl,
      "logo": `${siteUrl}/Riyora-Logo-Favicon.ico`,
      "sameAs": [
        "https://www.facebook.com/riyora", // update to your real social URLs
        "https://www.instagram.com/riyora"
      ]
    },
    // JobPosting: Sales & Marketing Specialist
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Sales & Marketing Specialist",
      "description":
        "Join Riyora Organic as a Sales & Marketing Specialist to promote our natural hair oils. Responsibilities include campaign planning, influencer outreach, and retail partnerships.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "Riyora Organic",
        "value": "RIS-JOB-001"
      },
      "datePosted": new Date().toISOString().split("T")[0],
      "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0],
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Riyora Organic",
        "sameAs": siteUrl,
        "logo": `${siteUrl}/Riyora-Logo-Favicon.ico`
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Remote / Hybrid",
          "addressRegion": "International"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": "Negotiable",
          "unitText": "MONTH"
        }
      }
    },
    // JobPosting: Influencer Partnership
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Influencer Partnership",
      "description":
        "Collaborate with Riyora Organic to promote premium hair oils. Ideal for influencers interested in sustainable beauty — includes affiliate and paid partnership options.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "Riyora Organic",
        "value": "RIS-JOB-002"
      },
      "datePosted": new Date().toISOString().split("T")[0],
      "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0],
      "employmentType": "CONTRACTOR",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Riyora Organic",
        "sameAs": siteUrl,
        "logo": `${siteUrl}/Riyora-Logo-Favicon.ico`
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Remote",
          "addressRegion": "International"
        }
      }
    }
  ];

  return (
    <>
      <Head>
        {/* Basic on-page SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Riyora Organic" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@riyoraofficial" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Preconnect for performance (fonts or CDNs if you use them) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* JSON-LD structured data (array) */}
        <script
          type="application/ld+json"
          // JSON-LD can be an array — stringify the structuredData array
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className={styles.container} aria-labelledby="career-heading">
        {/* Page heading: single H1 for SEO */}
        <h1 id="career-heading" className={styles.pageTitle}>
          Careers at Riyora Organic — Join Our Team
        </h1>

        <p className={styles.lead}>
          Riyora Organic is growing. We’re looking for passionate people and
          creators to help share our premium natural hair oils with the world.
          Below are current opportunities — apply or reach out to collaborate.
        </p>

        <section className={styles.cards} aria-label="Open positions">
          {/* Card 1: Sales & Marketing Specialist */}
          <article className={styles.career_card} aria-labelledby="sales-role">
            <figure className={styles.imageWrap}>
              <Image
                src="/images/join_us_career.png"
                alt="Join the Riyora Organic team - Sales & Marketing Specialist"
                width={300}
                height={300}
                sizes="(max-width: 768px) 100vw, 300px"
                priority={false}
              />
              <figcaption className="sr-only">
                Promotional image for Sales & Marketing Specialist role
              </figcaption>
            </figure>

            <div className={styles.text_area}>
              <h2 id="sales-role">Sales & Marketing Specialist</h2>
              <p>
                Help us grow Riyora Organic’s presence both online and in
                retail. You’ll manage marketing campaigns, support influencer
                outreach, and build partnerships that highlight our natural,
                high-quality hair oil products. Experience in beauty or health
                products is a plus.
              </p>

              {/* Internal contact link + mailto */}
              <p>
                <Link href="/about" aria-label="Learn more about Riyora Organic">
                  Learn more about Riyora
                </Link>
              </p>

              <Link
                href="mailto:info.riyoraorganic@gmail.com?subject=Application%20-%20Sales%20%26%20Marketing%20Specialist"
                aria-label="Apply for Sales & Marketing Specialist via email"
              >
                Apply Now
              </Link>
            </div>
          </article>

          {/* Card 2: Influencer Partnership */}
          <article className={styles.career_card} aria-labelledby="influencer-role">
            <figure className={styles.imageWrap}>
              <Image
                src="/images/influential_partnership.png"
                alt="Influencer Partnership opportunities at Riyora Organic"
                width={300}
                height={300}
                sizes="(max-width: 768px) 100vw, 300px"
                priority={false}
              />
              <figcaption className="sr-only">
                Promotional image for influencer partnership
              </figcaption>
            </figure>

            <div className={styles.text_area}>
              <h2 id="influencer-role">Influencer Partnership</h2>
              <p>
                Partner with us to showcase sustainable beauty and natural hair
                care. We offer affiliate programs and paid partnerships for
                creators who align with our values. Ideal partners have strong
                engagement and a passion for natural wellness.
              </p>

              <p>
                <Link href="/partnerships" aria-label="Partnership program details">
                  Partnership details
                </Link>
              </p>

              <Link
                href="mailto:info.riyoraorganic@gmail.com?subject=Influencer%20Partnership%20Inquiry"
                aria-label="Apply for influencer partnership via email"
              >
                Apply Now
              </Link>
            </div>
          </article>
        </section>

        {/* Helpful internal links for navigation and crawlability */}
        <nav aria-label="Career navigation" className={styles.careerNav}>
          <ul>
            <li>
              <Link href="/contact" aria-label="Contact Riyora Organic">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/jobs" aria-label="View all jobs">
                All Jobs
              </Link>
            </li>
            <li>
              <Link href="/faq" aria-label="Career FAQs">
                Career FAQs
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
};

export default career;
