import Head from "next/head";
import dbConnect from "@/server/db";
import Image from "next/image";
import { useEffect, useState } from "react";
import Product from "@/server/models/Product";
import styles from "@/styles/productPage.module.css";
import { onAddToCart, onBuy } from "@/components/ProductAction";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import getConfig from "next/config";
import Carousel from "@/components/Carousel";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import StarRating from "@/components/StartRating";
import { ToastContainer, toast } from "react-toastify";

import ReviewSection from "@/components/ReviewSection"; // ⬅️ reuse your review section component

const ExpandableSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={styles.expandable_section}>
      <h3 onClick={() => setIsOpen(!isOpen)} className={styles.expandable_title}>
        {title} {isOpen ? "-" : "+"}
      </h3>
      {isOpen && <div className={styles.expandable_content}>{children}</div>}
    </div>
  );
};

const ProductPage = ({ productId, productData }) => {
  if (!productId) return <h1>Product not found</h1>;

  const { publicRuntimeConfig } = getConfig();
  const site_url = publicRuntimeConfig.BASE_URL;
  const { data: session } = useSession();
  const router = useRouter();

  const [quantity_demanded, setQuantityDemanded] = useState(1);
  const [uMayLikeProducts, setUMayLikeProducts] = useState([]);

  // ================= Schema.org =================
  const [productSchema, setProductSchema] = useState({
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name,
    image: productData.imageUrl,
    description: productData.description,
    brand: { "@type": "Brand", name: productData.brand },
    sku: productData.sku,
    offers: {
      "@type": "Offer",
      url: `${site_url}/products/${productData.slug}`,
      priceCurrency: productData.currency,
      price: productData.price,
      availability:
        productData.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: productData.averageRating,
      reviewCount: productData.numReviews,
    },
  });

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get("/api/getProducts");
        if (res.status === 200) setUMayLikeProducts(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <>
      <Head>
        <title>{`${productData.name} | ${productData.brand}`}</title>
        <meta name="description" content={productData.description} />
        <meta name="keywords" content={productData.keywords?.join(", ")} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={productData.name} />
        <meta property="og:description" content={productData.description} />
        <meta property="og:image" content={`${site_url}${productData.imageUrl[0]}`} />
        <meta property="og:url" content={`${site_url}/products/${productData.slug}`} />

        {/* Canonical */}
        <link rel="canonical" href={`${site_url}/products/${productData.slug}`} />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>

      <div className="navHolder" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.product_container}>
        <section className={styles.sec_1}>
          <section className={styles.carousel}>
            <Carousel action_style="images">
              {productData.imageUrl.map((img, idx) => (
                <Image key={idx} src={img} width={500} height={500} alt={productData.name} />
              ))}
            </Carousel>
          </section>

          <div className={styles.details}>
            <div className={styles.paths}>
              <Link href="/">Home</Link> <span>/</span>
              <Link href="/products">Products</Link> <span>/</span>
              <Link href={`/products/${productData.slug}`}>{productData.name}</Link>
            </div>

            <h1>{productData.name}</h1>

            <div className={styles.ratings}>
              <StarRating rating={productData.averageRating} />
              <span>
                {productData.averageRating} ({productData.numReviews})
              </span>
            </div>

            <div className={styles.description}>
              <p>{productData.description}</p>
            </div>

            {/* Pricing + Quantity */}
            <div className={styles.price_quantity}>
              <div className={styles.price}>
                {productData.discountPercentage > 0 && (
                  <>
                    <span className={styles.discount_perc}>{productData.discountPercentage}% OFF</span>
                    <span className={styles.originalPrice}>₹{productData.mrp}</span>
                  </>
                )}
                <span className={styles.salePrice}>₹{productData.price}</span>
                <p className={styles.price_text}>{productData.quantity} | no extra charges</p>
              </div>

              <div className={styles.quantity}>
                <button onClick={() => setQuantityDemanded((q) => (q > 1 ? q - 1 : 1))}>-</button>
                <span>{quantity_demanded}</span>
                <button onClick={() => setQuantityDemanded(quantity_demanded + 1)}>+</button>
              </div>
            </div>

            {/* Choose Us */}
            {productData?.chooseUs.length > 0 && (

              <section className={styles.icons}>
                {productData.chooseUs?.map((item, idx) => (
                  <Image key={idx} src={item?.imageUrl} width={80} height={80} alt={item.text} title={item.text} />
                ))}
              </section>
            )}

            {/* Actions */}
            <div className={styles.action_btn}>
              <button
                onClick={() =>
                  onAddToCart(router, productId, session).success === false
                    ? toast.error("Unable To Add to Cart")
                    : toast.success("Added To Cart")
                }
              >
                Add To Cart
              </button>
              <button onClick={() => onBuy(router, productId, quantity_demanded, session)}>Buy Now</button>
            </div>

            {/* Variants */}
            {productData.variants && (

              <div className={styles.variants}>
                {productData.variants?.map((variant, idx) => (
                  <Link key={idx} href={`/products/${variant.product_id}`} className={styles.variant_card}>
                    <Image
                      src={variant?.imageUrl || productData?.imageUrl[0]}
                      width={100}
                      height={100}
                      alt={`${variant.name} variant`}
                    />
                    <div className={styles.variant_text}>
                      <span>{variant.name}</span>
                      <span className={styles.variant_price}>₹{variant.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Details */}
            <ExpandableSection title="Top Highlights">
              <div className={styles.highlights}>

                <p><strong>Key Ingredients - </strong>{productData.details?.keyIngredients?.join(", ")}</p>
                <p><strong>Ingredients - </strong>{productData.details?.ingredients?.join(", ")}</p>

                <p><strong>Material Type Free - </strong>Alcohol Free, Cruelty Free, Dye Free, Hexane Free, Paraben Free, Mineral Oil Free, Palm oill Free, SLS Free, Silicone Free, Free From Toxic Chemicals, No Artificial Colours, No Artificial Fragrance </p>

                <p><strong>Hair Type - </strong>{productData.details.hairType}</p>

                <p><strong>Product Benefits - </strong> {productData.details?.benefits?.join(", ")}</p>

                <p><strong>Item Form - </strong>{productData.details.itemForm}</p>
                <p><strong>Item Volume - </strong>{productData.details.itemVolume}</p>
              </div>

            </ExpandableSection>

            <ExpandableSection title="Specifications">
              <table className={styles.specifications}>
                <tbody>
                  {Object.entries(productData.specifications || {}).map(([k, v]) => (
                    <tr key={k}>
                      <td className={styles.strong}>{k}</td>
                      <td>{v || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ExpandableSection>

            <ExpandableSection title="Disclaimer">

              <ol className={styles.disclaimer}>

                {Object.entries(productData.disclaimers || {}).map(([k, v]) => (
                  <li key={k}>
                    {v}
                  </li>
                ))}
              </ol>
            </ExpandableSection>

            <ExpandableSection title="Suitable For">
              <div className={styles.suitable_cards}>
                {productData.suitableFor?.map((s, idx) => (
                  <div key={idx} className={styles.suitable_images}>
                    <Image src={s?.imageUrl} width={300} height={300} alt={s.text} />
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
            </ExpandableSection>
          </div>
        </section>

        {/* How to Apply */}
        <section>
          <h2>How <span>to Apply</span></h2>
          <div className={styles.apply_section}>
            {productData.howToApply?.map((step, idx) => (
              <div key={idx} className={styles.apply_box}>
                <Image src={step?.imageUrl} width={300} height={300} alt={step.title} />
                <div>
                  <h4>Step {step.step}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews">
          <ReviewSection reviews={productData.reviews} productId={productId} />
        </section>
      </div>
    </>
  );
};

// ================== SSG ==================
export async function getStaticPaths() {
  await dbConnect();
  const products = await Product.find({}, "slug");

  return {
    paths: products.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();

  if (!product) return { notFound: true };

  return {
    props: {
      productId: product._id.toString(),
      productData: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 600,
  };
}

export default ProductPage;
