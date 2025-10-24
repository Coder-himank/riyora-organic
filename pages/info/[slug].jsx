// pages/product/[slug].js
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/ProductInfo.module.css";
import connectDB from "@/server/db";
import productInfo from "@/server/models/productInfo";
import InfiniteCarousel from "@/components/ImageCarousel";
export default function ProductDetail({ product }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Product Header */}
      <div className={styles.header}>
        <div className={styles.imageGallery}>
          {/* {product.imageUrl.map((img, idx) => ( */}
          <div className={styles.imageWrapper}>
            <InfiniteCarousel
              images={product.imageUrl}
            >

              {/* 
              <Image
                src={img}
                alt={`${product.title} image ${idx + 1}`}
                fill
                className={styles.image}
              /> */}
            </InfiniteCarousel>
          </div>
          {/* ))} */}
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>index
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>

      {/* Ingredients */}
      {product.ingredients?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Ingredients</h2>
          <div className={styles.ingredientsGrid}>
            {product.ingredients.map((ingredient, idx) => (
              <div key={idx} className={styles.ingredientCard}>
                <div className={styles.ingredientImage}>

                  <Image
                    src={product.imageUrl[0]}
                    alt={ingredient.name}
                    width={60}
                    height={60}
                  />
                </div>
                <h3>{ingredient.name}</h3>
                {ingredient.notes?.length > 0 && (
                  <ul className={styles.notes}>
                    {ingredient.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      {product.benefits && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{product.benefits.heading}</h2>
          <ul className={styles.benefitsList}>
            {product.benefits.list.map((benefit, idx) => (
              <li key={idx} className={styles.benefit}>
                ✅ {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suitability */}
      {product.suitability?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Suitable For</h2>
          <div className={styles.tags}>
            {product.suitability.map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ✅ Server-side rendering to fetch product by slug
export async function getServerSideProps({ params }) {
  await connectDB();
  const product = await productInfo.findOne({ slug: params.slug }).lean();

  if (!product) {
    return { notFound: true };
  }

  product._id = product._id.toString(); // serialize
  return { props: { product: JSON.parse(JSON.stringify(product)) } };
}
