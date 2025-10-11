// pages/products/[slug].jsx
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
import ReviewSection from "@/components/ReviewSection";
import InfiniteCarousel from "@/components/ImageCarousel";
import InfinteScroller from "@/components/InfinteScroller";

import Tabs from "@/components/Tabs";
import ProductInfo from "@/server/models/productInfo";

function camelToNormal(text) {
  return text
    // insert space before capital letters
    .replace(/([A-Z])/g, ' $1')
    // trim any leading space
    .trim()
    // capitalize the first letter
    .replace(/^./, str => str.toUpperCase());
}



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

const ProductPage = ({ productId, pdata, pInfodata }) => {
  if (!productId) return <h1>Product not found</h1>;

  const { publicRuntimeConfig } = getConfig();
  const site_url = publicRuntimeConfig.BASE_URL;
  const { data: session } = useSession();
  const router = useRouter();
  const [productData, setProductData] = useState(pdata);
  const [quantity_demanded, setQuantityDemanded] = useState(1);
  const [uMayLikeProducts, setUMayLikeProducts] = useState([]);

  if (!productData) return <h1>Loading...</h1>


  // ============ Variants Support =============

  //selecting the varinat from url or default
  // replace this:
  // const [selectedVariant, setSelectedVariant] = useState({ ...productData });

  // initial state
  const [selectedVariant, setSelectedVariant] = useState(null);

  // set initial variant based on query or first variant; fallback to null
  useEffect(() => {
    if (!productData) return;

    if (productData.variants?.length) {
      const queryVariant = router.query.variantId;
      let initialVariant;
      if (queryVariant) {
        const gotV = productData.variants.find((v) => String(v._id) === String(queryVariant))
        initialVariant = gotV ? gotV : productData;
      } else {
        initialVariant = productData;
      }

      setSelectedVariant(initialVariant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [router.query.variantId, productData]);


  // Normalize imageUrl for variants (added for variants)
  const normalizeVariantImages = (variant) => {
    if (!variant) return [];
    return Array.isArray(variant.imageUrl) ? variant.imageUrl : variant.imageUrl ? [variant.imageUrl] : [];
  };

  const displayProduct = selectedVariant
    ? {
      ...productData,                // base product fields
      price: selectedVariant.price,   // override variant-specific fields
      mrp: selectedVariant.mrp,
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
      quantity: selectedVariant.quantity,
      imageUrl: normalizeVariantImages(selectedVariant).length > 0
        ? normalizeVariantImages(selectedVariant)
        : productData?.imageUrl,

      name: selectedVariant.name || productData.name,
    }
    : {
      ...productData
    };

  // ================= Schema.org =================
  const [productSchema, setProductSchema] = useState(null);

  useEffect(() => {
    if (productData.variants?.length) {
      const queryVariant = router.query.variantId;
      const initialVariant = queryVariant
        ? productData.variants.find((v) => v._id.toString() === queryVariant)
        : productData;

      setSelectedVariant(initialVariant || null);
    }
  }, [router.query.variantId, productData.variants, productData]);

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

  useEffect(() => { }, [displayProduct]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`/api/getProducts?productId=${productId}`);
        console.log(red.data);

        if (res.status === 200) {
          setProductData({ ...res.data });
          setProductSchema({
            "@context": "https://schema.org",
            "@type": "Product",
            name: displayProduct?.name,
            image: displayProduct?.imageUrl,
            description: displayProduct?.description,
            brand: { "@type": "Brand", name: displayProduct?.brand },
            sku: displayProduct?.sku,
            offers: {
              "@type": "Offer",
              url: `${site_url}/products/${displayProduct?.slug}`,
              priceCurrency: displayProduct?.currency,
              price: displayProduct?.price,
              availability:
                displayProduct?.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: displayProduct?.averageRating,
              reviewCount: displayProduct?.numReviews,
            },
          })
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchProductData()
  }, [])


  const VaraintCard = ({ variant }) => {
    const isSelected =
      (selectedVariant?._id && String(selectedVariant._id) === String(variant._id)) ||
      (!selectedVariant && variant._id === productId); // handle base product case

    return (
      <div
        className={`${styles.variant_card} ${isSelected ? styles.selected_variant : ""}`}
        onClick={() => {
          setSelectedVariant(variant);
          router.push(
            { pathname: router.pathname, query: { ...router.query, variantId: variant._id } },
            undefined,
            { shallow: true }
          );
        }}
      >
        <div className={styles.variant_text}>
          <span>{variant.quantity}</span>
        </div>
      </div>
    );
  };

  if (!productData) return <h1>Loading...</h1>

  const SpecSection = () => {
    return (
      <>

        <ExpandableSection title="Specifications">
          <table className={styles.specifications}>
            <tbody>
              {Object.entries(displayProduct?.specifications || {}).map(([k, v]) => (
                <tr key={k}>
                  {k === "weight" ? (
                    <>
                      <td className={styles.strong}>{camelToNormal(k)}</td>
                      <td>{displayProduct?.quantity || "-"}</td>
                    </>
                  ) : (
                    <>
                      <td className={styles.strong}>{camelToNormal(k)}</td>
                      <td>{v || "-"}</td>
                    </>
                  )
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </ExpandableSection>


      </>
    )
  }


  const DisclaimerSection = () => {
    return (
      <>

        <ExpandableSection title="Disclaimer">
          <ol className={styles.disclaimer}>
            {Object.entries(displayProduct?.disclaimers || {}).map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ol>
        </ExpandableSection>


      </>
    )
  }

  const SuitableSection = () => {
    return (
      <>
        <ExpandableSection title="Suitable For">
          <div className={styles.suitable_cards}>
            {displayProduct?.suitableFor?.map((s, idx) => (
              <div key={idx} className={styles.suitable_images}>
                <Image src={s?.imageUrl} width={300} height={300} alt={s.text} />
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </ExpandableSection>

      </>
    )
  }

  const TopHeighlights = () => {
    return (
      <>

        {/* Expandable Sections */}
        <ExpandableSection title="Top Highlights">
          <div className={styles.highlights}>
            <p><strong>Key Ingredients - </strong>{displayProduct?.details?.keyIngredients?.join(", ")}</p>
            <p><strong>Ingredients - </strong>{displayProduct?.details?.ingredients?.join(", ")}</p>
            <p><strong>Material Type Free - </strong>Alcohol Free, Cruelty Free, Dye Free, Hexane Free, Paraben Free, Mineral Oil Free, Palm oill Free, SLS Free, Silicone Free, Free From Toxic Chemicals, No Artificial Colours, No Artificial Fragrance </p>
            <p><strong>Hair Type - </strong>{displayProduct?.details?.hairType}</p>
            <p><strong>Product Benefits - </strong> {displayProduct?.details?.benefits?.join(", ")}</p>
            <p><strong>Item Form - </strong>{displayProduct?.details?.itemForm}</p>
            <p><strong>Item Volume - </strong>{displayProduct?.details?.itemVolume}</p>
          </div>
        </ExpandableSection>

      </>
    )
  }

  const DescriptionTab = () => {
    return (
      <div className={styles.description_tab}>

        <h3>Description</h3>
        <p>{pInfodata?.description}</p>
      </div>
    );
  }


  const IngredientsTab = () => {
    return (
      <div className={styles.ingredients_tab}>
        <h3>Ingredients</h3>

        <Carousel
          showControls={false}>
          {pInfodata?.ingredients?.map((ingredient, idx) => (
            <div className={styles.ingredient_card}>

              <Image src={ingredient?.image} width={150} height={150} alt={ingredient.name} />
              <div className={styles.text_wrapper}>

                <h4>{ingredient.name}</h4>
                <ul>
                  {ingredient?.notes?.map((note, nidx) => (
                    <li key={nidx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Carousel>

      </div>
    );
  }

  const BenefitsTab = () => {
    return (
      <div className={styles.benefits_tab}>
        <h3>Benefits Products</h3>
        <ul>
          {pInfodata?.benefits?.list?.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>
    );
  }
  const tabsObject = {
    "Description": <DescriptionTab />,
    "Ingredients": <IngredientsTab />,
    "Benefits": <BenefitsTab />,
    // add more tabs as needed
  };

  return (
    <>
      <Head>
        <title>{`${displayProduct?.name} | ${displayProduct?.brand}`}</title>
        <meta name="description" content={displayProduct?.description} />
        <meta name="keywords" content={displayProduct?.keywords?.join(", ")} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={displayProduct?.name} />
        <meta property="og:description" content={displayProduct?.description} />
        <meta property="og:image" content={`${site_url}${displayProduct?.imageUrl[0]}`} />
        <meta property="og:url" content={`${site_url}/products/${displayProduct?.slug}`} />

        {/* Canonical */}
        <link rel="canonical" href={`${site_url}/products/${displayProduct?.slug}`} />

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
            <InfiniteCarousel images={displayProduct?.imageUrl} />

          </section>

          <div className={styles.details}>
            <div className={styles.paths}>
              <Link href="/">Home</Link> <span>/</span>
              <Link href="/products">Products</Link> <span>/</span>
              <Link href={`/products/${displayProduct?.slug}`}>{displayProduct?.name}</Link>
            </div>

            <h1>{displayProduct?.name}</h1>

            <Link href={"#reviews"} style={{ maxWidth: "fit-content" }}>
              <div className={styles.ratings}>
                <StarRating rating={displayProduct?.averageRating} />
                <span>
                  {displayProduct?.averageRating} ({displayProduct?.numReviews})
                </span>
              </div>
            </Link>

            <div className={styles.description}>
              <p>{displayProduct?.description}</p><br />
            </div>


            {/* Variants section */}
            {productData.variants && productData?.variants?.length > 0 && (
              <div className={styles.variants}>
                <VaraintCard variant={{
                  ...productData
                }} />

                {productData.variants.map((variant, idx) => (
                  <VaraintCard key={idx} variant={variant} />
                ))}
              </div>
            )}

            {/* Pricing + Quantity */}
            <div className={styles.price_quantity}>
              <div className={styles.price}>
                {displayProduct?.discountPercentage > 0 && (
                  <>
                    <span className={styles.discount_perc}>{displayProduct?.discountPercentage}% OFF</span>
                    <span className={styles.originalPrice}>₹{displayProduct?.mrp}</span>
                  </>
                )}
                <span className={styles.salePrice}>₹{displayProduct?.price}</span>
                <p className={styles.price_text}>{displayProduct?.quantity} | GST included</p>
              </div>

              <div className={styles.quantity}>
                <button onClick={() => setQuantityDemanded((q) => (q > 1 ? q - 1 : 1))}>-</button>
                <span>{quantity_demanded}</span>
                <button onClick={() => setQuantityDemanded(quantity_demanded + 1 > 5 ? 5 : quantity_demanded + 1)}>+</button>
              </div>
            </div>





            {/* Actions */}
            <div className={styles.action_btn}>
              <button
                onClick={() =>
                  onAddToCart(router, displayProduct?._id, session, quantity_demanded, selectedVariant?._id)
                    .success === false
                    ? toast.error("Unable To Add to Cart")
                    : toast.success("Added To Cart")
                }
              >
                Add To Cart
              </button>
              <button
                onClick={() => onBuy(router, displayProduct?._id, quantity_demanded, session, selectedVariant?._id)}
              >
                Buy Now
              </button>
            </div>


            {/* Choose Us */}
            {displayProduct?.chooseUs?.length > 0 && (
              <section className={styles.icons}>
                {/* <Carousel
                  showControls={false}
                > */}

                <InfinteScroller>


                  {displayProduct?.chooseUs?.map((item, idx) => (
                    <div className={styles.icon} key={idx}>
                      <Image src={item?.imageUrl} width={80} height={80} alt={item.text} title={item.text} />
                      <p>{item.text}</p>
                    </div>
                  ))}
                </InfinteScroller>
                {/* </Carousel> */}
              </section>
            )}

            <Link href={`/info/${productData.slug}`}>
              <div className={styles.productInfoBtn}>

                Know More
              </div>
            </Link>

            <TopHeighlights />
            <SpecSection />
            <DisclaimerSection />
            <SuitableSection />

          </div>



        </section >


        {/* Product Info Sections */}

        < Tabs
          tabs={tabsObject}
        ></ Tabs>

        {/* How to Apply */}
        < section >
          <h2>How <span>to Apply</span></h2>
          <div className={styles.apply_section}>
            {displayProduct?.howToApply?.map((step, idx) => (
              <div key={idx} className={styles.apply_box}>
                <Image src={step?.imageUrl} width={300} height={300} alt={step.title} />
                <div>
                  <h4>Step {step.step}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ section >

        {/* Reviews */}
        < section id="reviews" >
          <ReviewSection reviews={displayProduct?.reviews} productId={productId} />
        </ section >
      </div >
    </>
  );
};

// ================== SSG ==================
export async function getStaticPaths() {
  await dbConnect();
  const products = await Product.find({ visible: true }, "slug");

  return {
    paths: products.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();
  const productInfo = await ProductInfo.findOne({ slug: params.slug }).lean();


  if (!product) return { notFound: true };

  // Ensure imageUrl and variants.imageUrl are arrays (added for variants)
  const normalizedProduct = product

  const normalizedProductInfo = productInfo;
  // {
  //   ...product,
  //   imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl : product.imageUrl ? [product.imageUrl] : [],
  //   variants: product.variants?.map(v => ({
  //     ...v,
  //     imageUrl: Array.isArray(v.imageUrl) ? v.imageUrl : v.imageUrl ? [v.imageUrl] : [],
  //   })) || [],
  // };


  return {
    props: {
      productId: product._id.toString(),
      pdata: JSON.parse(JSON.stringify(normalizedProduct)),
      pInfodata: JSON.parse(JSON.stringify(normalizedProductInfo)),
    },
    revalidate: 600,
  };
}

export default ProductPage;
