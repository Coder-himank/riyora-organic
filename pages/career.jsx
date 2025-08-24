import styles from "@/styles/career.module.css";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
export const career = () => {
  return (
    <>
      <Head>
        <title>
          Careers at Riyora Organic - Join Our Natural Hair Oil Team
        </title>
        <meta
          name="description"
          content="Discover career opportunities and influencer partnerships at Riyora Organic. Join our team and help promote premium natural hair oils for healthy, beautiful hair."
        />
        <meta
          name="keywords"
          content="Riyora Organic careers, hair oil jobs, influencer partnership, natural hair care, join Riyora Organic, organic beauty jobs"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Careers at Riyora Organic - Join Our Natural Hair Oil Team"
        />
        <meta
          property="og:description"
          content="Discover career opportunities and influencer partnerships at Riyora Organic. Join our team and help promote premium natural hair oils for healthy, beautiful hair."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://riyora-organic.vercel.app/career"
        />
        <meta property="og:image" content="/images/join_us_career.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.cards}>
          <div className={styles.career_card}>
            <Image
              src="/images/join_us_career.png"
              alt="Join the Riyora Organic Team"
              width={300}
              height={300}
            />
            <div className={styles.text_area}>
              <h4>Sales & Marketing Specialist</h4>
              <p>
                Help us spread the word about Riyora Organic's natural hair
                oils. Work with a passionate team dedicated to healthy,
                beautiful hair.
              </p>
              <Link href="mailto:career.riyoraorganic@gmail.com">
                Apply Now
              </Link>
            </div>
          </div>

          <div className={styles.career_card}>
            <Image
              src="/images/influential_partnership.png"
              alt="Influencer Partnership at Riyora Organic"
              width={300}
              height={300}
            />
            <div className={styles.text_area}>
              <h4>Influencer Partnership</h4>
              <p>
                Partner with Riyora Organic to promote our premium hair oils.
                Collaborate with us to inspire natural beauty and wellness.
              </p>
              <Link href="mailto:career.riyoraorganic@gmail.com">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default career;
