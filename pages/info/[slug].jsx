// pages/product/[slug].js
import Image from "next/image";
import styles from "@/styles/ProductInfo.module.css";
import connectDB from "@/server/db";
import ProductInfo from "@/server/models/productInfo";

export default function ProductPage({ productInfo }) {
  if (!productInfo) return <p className={styles.notFound}>Product not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{productInfo.title}</h1>

      {productInfo.imageUrl?.[0] && (
        <div className={styles.imageWrapper}>
          <Image
            src={productInfo.imageUrl[0]}
            alt={productInfo.title}
            width={500}
            height={500}
            className={styles.mainImage}
          />
        </div>
      )}

      <p className={styles.description}>{productInfo.description}</p>

      {productInfo.ingredients?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
          <div className={styles.ingredientsGrid}>
            {productInfo.ingredients.map((ing, idx) => (
              <div key={idx} className={styles.ingredientCard}>
                {ing.image && (
                  <Image src={ing.image} alt={ing.name} width={80} height={80} />
                )}
                <span>{ing.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {productInfo.benefits?.list?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {productInfo.benefits.heading || "Benefits"}
          </h2>
          <ul className={styles.benefitsList}>
            {productInfo.benefits.list.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {productInfo.suitability?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Suitable For</h2>
          <ul className={styles.suitabilityList}>
            {productInfo.suitability.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Generate static paths based on productInfo titles
export async function getStaticPaths() {
  await connectDB();
  const products = await ProductInfo.find({}).lean();

  const paths = products.map((p) => ({
    params: { slug: p.slug },
  }));

  return { paths, fallback: false };
}

// Fetch product info based on slug
export async function getStaticProps({ params }) {
  await connectDB();
  const product = await ProductInfo.findOne({
    slug: params.slug,
  }).lean();

  return { props: { productInfo: JSON.parse(JSON.stringify(product)) || null } };
}
