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
import { FaAngleDown } from "react-icons/fa";
import Tabs from "@/components/Tabs";
import ProductInfo from "@/server/models/productInfo";

/** Helpers **/
function camelToNormal(text) {
  return text
    // insert space before capital letters
    .replace(/([A-Z])/g, " $1")
    // trim any leading space
    .trim()
    // capitalize the first letter
    .replace(/^./, (str) => str.toUpperCase());
}

const RenderBanners = ({ position, banners }) => {
  if (!banners || !Array.isArray(banners)) return null;
  return (
    <>
      {banners
        .filter((b) => b.position === position)
        .map((b, idx) => (
          <section className={styles.banner} key={idx}>
            <Image
              src={b.imageUrl || "/images/banner1.png"}
              width={1080}
              height={500}
              alt={b.alt || "Banner"}
            />
          </section>
        ))}
    </>
  );
};

const ExpandableSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={styles.expandable_section}>
      <h3
        onClick={() => setIsOpen((s) => !s)}
        className={styles.expandable_title}
      >
        {title} {isOpen ? <FaAngleDown /> : ">"}
      </h3>
      {isOpen && <div className={styles.expandable_content}>{children}</div>}
    </div>
  );
};

const normalizeVariantImages = (variant) => {
  if (!variant) return [];
  return Array.isArray(variant.imageUrl)
    ? variant.imageUrl
    : variant.imageUrl
      ? [variant.imageUrl]
      : [];
};

const ProductPage = ({ productId, pdata, pInfodata }) => {
  if (!productId) return <h1>Product not found</h1>;

  const { publicRuntimeConfig } = getConfig();
  const site_url = publicRuntimeConfig.BASE_URL;
  const { data: session } = useSession();
  const router = useRouter();

  // initial states use SSG-provided pdata
  const [productData, setProductData] = useState(pdata);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity_demanded, setQuantityDemanded] = useState(1);
  const [uMayLikeProducts, setUMayLikeProducts] = useState([]);
  const [productSchema, setProductSchema] = useState(null);
  const [isLiveUpdated, setIsLiveUpdated] = useState(false);

  // guard: don't render until we have pdata
  if (!productData) return <h1>Loading...</h1>;

  // ============ Variant selection (single effect) ============
  // ✅ FIXED variant selector logic
  useEffect(() => {
    if (!productData) return;

    const queryVariant = router.query.variantId;
    let newVariant = null;

    if (productData.variants?.length) {
      if (queryVariant) {
        newVariant = productData.variants.find(
          (v) => String(v._id) === String(queryVariant)
        );
      }
    }

    // avoid flicker / double toggle
    if (newVariant && newVariant._id !== selectedVariant?._id) {
      setSelectedVariant(newVariant);
    } else if (!queryVariant && !selectedVariant) {
      setSelectedVariant(null); // or base product if needed
    }
  }, [router.query.variantId, productData]);

  // ============ Compose displayProduct (variant-aware) ============
  const displayProduct = selectedVariant
    ? {
      ...productData,
      price: selectedVariant.price ?? productData.price,
      mrp: selectedVariant.mrp ?? productData.mrp,
      stock: selectedVariant.stock ?? productData.stock,
      sku: selectedVariant.sku ?? productData.sku,
      quantity: selectedVariant.quantity ?? productData.quantity,
      imageUrl:
        normalizeVariantImages(selectedVariant)?.length > 0
          ? normalizeVariantImages(selectedVariant)
          : productData?.imageUrl,
      specifications: {
        ...productData.specifications,
        productDimensions:
          selectedVariant?.specifications?.productDimensions ||
          selectedVariant?.dimensions ||
          productData.specifications?.productDimensions,
        weight: selectedVariant?.weight ?? productData.specifications?.weight,
      },
      name: selectedVariant.name || productData.name,
    }
    : { ...productData };

  // ============ Fetch recommended products (once) ============
  useEffect(() => {
    let mounted = true;
    const fetchRecommended = async () => {
      try {
        const res = await axios.get("/api/getProducts"); // adjust query if needed
        if (res.status === 200 && mounted) setUMayLikeProducts(res.data);
      } catch (e) {
        console.error("fetchRecommended error:", e);
      }
    };
    fetchRecommended();
    return () => {
      mounted = false;
    };
  }, []);

  // ============ Fetch live product data safely (hydrate updates) ============
  useEffect(() => {
    let cancelled = false;
    const fetchLiveProductData = async () => {
      try {
        const { status, data } = await axios.get(
          `/api/getProducts?productId=${productId}`
        );
        if (status === 200 && !cancelled) {
          // compare shapes lightly to avoid unnecessary re-renders
          // (deep comparison is expensive; we do JSON compare which is acceptable here)
          if (JSON.stringify(data[0]) !== JSON.stringify(productData)) {
            // console.log(data);
            setProductData(data[0]);
            setIsLiveUpdated(true);
          }
        }
      } catch (err) {
        console.error("Error fetching live product:", err);
      }
    };

    fetchLiveProductData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]); // run once per page load / productId

  // ============ Build robust productSchema (only when displayProduct ready) ============
  useEffect(() => {
    if (!displayProduct) return;

    const absImageUrls = (
      Array.isArray(displayProduct.imageUrl)
        ? displayProduct.imageUrl
        : [displayProduct.imageUrl]
    )
      .filter(Boolean)
      .map((url) => (url.startsWith("http") ? url : `${site_url}${url}`));

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: displayProduct?.name || "",
      description: displayProduct?.description || "",
      sku: displayProduct?.sku || "",
      mpn: displayProduct?.mpn || displayProduct?.sku || "",
      brand: {
        "@type": "Brand",
        name: displayProduct?.brand || "",
      },
      category: displayProduct?.category || "",
      image: absImageUrls,
      offers: {
        "@type": "Offer",
        url: `${site_url}/products/${displayProduct?.slug}`,
        priceCurrency: displayProduct?.currency || "INR",
        price: Number(displayProduct?.price || 0).toFixed(2),
        availability:
          displayProduct?.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Riyora Organic",
          url: site_url,
          logo: `${site_url}/images/logo.png`,
        },
        priceValidUntil: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };

    if (displayProduct?.averageRating) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(displayProduct.averageRating).toFixed(1),
        reviewCount: Number(displayProduct.numReviews || 0),
        bestRating: "5",
        worstRating: "1",
      };
    }

    if (Array.isArray(displayProduct?.reviews) && displayProduct.reviews.length) {
      schema.review = displayProduct.reviews
        .filter((r) => r?.comment || r?.rating)
        .map((r) => ({
          "@type": "Review",
          author:
            typeof r.user === "string" ? r.user : r.user?.name || "Anonymous",
          datePublished: r.date || "",
          reviewBody: r.comment || "",
          reviewRating: {
            "@type": "Rating",
            ratingValue: Number(r.rating || 0),
            bestRating: "5",
            worstRating: "1",
          },
        }));
    }

    if (displayProduct?.specifications) {
      schema.additionalProperty = Object.entries(
        displayProduct.specifications
      ).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: camelToNormal(key),
        value: String(value),
      }));
    }

    setProductSchema(schema);
  }, [pdata, site_url]);

  // ============ Variant card component (inline) ============
  const VariantCard = ({ variant }) => {
    const isSelected =
      (selectedVariant?._id && String(selectedVariant._id) === String(variant._id)) ||
      (!selectedVariant && variant._id === productId); // fallback
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

  // ============ UI Helpers =============
  const decreaseQty = () =>
    setQuantityDemanded((q) => (q > 1 ? q - 1 : 1));
  const increaseQty = () =>
    setQuantityDemanded((q) => (q + 1 > 5 ? 5 : q + 1));

  // ============ Spec/Disclaimer/Suitable sections =============
  const SpecSection = () => (
    <ExpandableSection title="Specifications" defaultOpen={false}>
      <table className={styles.specifications}>
        <tbody>
          {Object.entries(displayProduct?.specifications || {}).map(([k, v]) => (
            <tr key={k}>
              {k === "weight" ? (
                <>
                  <td className={styles.strong}>{camelToNormal(k)}</td>
                  <td>{displayProduct?.specifications?.weight || displayProduct?.quantity || "-"}</td>
                </>
              ) : (
                <>
                  <td className={styles.strong}>{camelToNormal(k)}</td>
                  <td>{v || "-"}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableSection>
  );

  const DisclaimerSection = () => (
    <ExpandableSection title="Disclaimer" defaultOpen={false}>
      <ol className={styles.disclaimer}>
        {Object.entries(displayProduct?.disclaimers || {}).map(([k, v]) => (
          <li key={k}>{v}</li>
        ))}
      </ol>
    </ExpandableSection>
  );

  const SuitableSection = () => (
    <ExpandableSection title="Suitable For">
      <div className={styles.suitable_cards}>
        {displayProduct?.suitableFor?.map((s, idx) => (
          <div key={idx} className={styles.suitable_images}>
            <Image src={s?.imageUrl} width={300} height={300} alt={s.name} />
            <p>{s.name}</p>
          </div>
        ))}
      </div>
    </ExpandableSection>
  );

  const TopHighlights = () => (
    <ExpandableSection title="Top Highlights">
      <div className={styles.highlights}>
        <p><strong>Key Ingredients - </strong>{displayProduct?.details?.keyIngredients?.join(", ")}</p>
        <p><strong>Ingredients - </strong>{displayProduct?.details?.ingredients?.join(", ")}</p>
        <p><strong>Material Type Free - </strong>Alcohol Free, Cruelty Free, Dye Free, Hexane Free, Paraben Free, Mineral Oil Free, Palm oil Free, SLS Free, Silicone Free, Free From Toxic Chemicals, No Artificial Colours, No Artificial Fragrance </p>
        <p><strong>Hair Type - </strong>{displayProduct?.details?.hairType}</p>
        <p><strong>Product Benefits - </strong> {displayProduct?.details?.benefits?.join(", ")}</p>
        <p><strong>Item Form - </strong>{displayProduct?.details?.itemForm}</p>
      </div>
    </ExpandableSection>
  );

  // Tabs content (Description, Ingredients, Benefits, How To Use)
  const DescriptionTab = () => (
    <div className={styles.description_tab}>
      <h3>Description</h3>
      <p>{pInfodata?.description}</p>
    </div>
  );

  const IngredientsTab = () => (
    <div className={styles.ingredients_tab}>
      <h3>Ingredients</h3>
      <Carousel showControls={false}>
        {pInfodata?.ingredients?.map((ingredient, idx) => (
          <div className={styles.ingredient_card} key={idx}>
            <Image src={ingredient?.imageUrl} width={150} height={150} alt={ingredient.name} />
            <div className={styles.text_wrapper}>
              <h4>{ingredient?.name}</h4>
              <p>{ingredient?.description}</p>
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

  const BenefitsTab = () => (
    <div className={styles.benefits_tab}>
      <h3>Benefits Products</h3>
      <ul>
        {pInfodata?.benefits?.list?.map((benefit, idx) => (
          <li key={idx}>{benefit}</li>
        ))}
      </ul>
    </div>
  );

  const HowToUse = () => (
    <section className={styles.howtouse_tab}>
      <h3>How <span>to Apply</span></h3>
      <div className={styles.apply_section}>
        {displayProduct?.howToApply?.map((step, idx) => (
          <div key={idx} className={styles.apply_box}>
            <div>
              <h4>Step {step.step}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const tabsObject = {
    Description: <DescriptionTab />,
    Ingredients: <IngredientsTab />,
    Benefits: <BenefitsTab />,
    "How To Use": <HowToUse />,
  };

  // ============ Render =============
  return (
    <>
      <Head>
        <title>{`${displayProduct?.name} | ${displayProduct?.brand} - Riyora Organic`}</title>
        <meta name="description" content={displayProduct?.description?.slice(0, 160)} />
        <meta name="keywords" content={displayProduct?.keywords?.join?.(", ") || ""} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${site_url}/products/${displayProduct?.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${displayProduct?.name} | ${displayProduct?.brand}`} />
        <meta property="og:description" content={displayProduct?.description?.slice(0, 160)} />
        <meta property="og:image" content={`${site_url}${displayProduct?.imageUrl?.[0] || ""}`} />
        <meta property="og:url" content={`${site_url}/products/${displayProduct?.slug}`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${displayProduct?.name} | ${displayProduct?.brand}`} />
        <meta name="twitter:description" content={displayProduct?.description?.slice(0, 160)} />
        <meta name="twitter:image" content={`${site_url}${displayProduct?.imageUrl?.[0] || ""}`} />

        {/* Structured Data (JSON-LD) — render only when valid */}
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema, null, 2) }}
          />
        )}
      </Head>

      <div className="navHolder" />
      <ToastContainer position="top-right" autoClose={3000} />

      <RenderBanners position={"top"} banners={productData.banners} />

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

            <Link href={"#product_info_tabs"}>
              <div className={styles.description}>
                <p>{displayProduct?.description?.length > 300 ? displayProduct.description.slice(0, 300) + "..." : displayProduct.description}</p><br />
              </div>
            </Link>

            {/* Variants */}
            {productData.variants && productData?.variants?.length > 0 && (
              <div className={styles.variants}>
                <VariantCard variant={{ ...productData }} />
                {productData.variants.map((variant, idx) => (
                  <VariantCard key={idx} variant={variant} />
                ))}
              </div>
            )}

            {/* Pricing + Quantity */}
            <div className={styles.price_quantity}>
              <div className={styles.price}>
                {displayProduct?.discountPercentage > 0 && (
                  <>
                    <span className={styles.discount_perc}>{displayProduct?.discountPercentage}% OFF</span>
                    <span className={styles.originalPrice}>MRP : ₹{displayProduct?.mrp}</span>
                  </>
                )}
                <span className={styles.salePrice}> ₹{displayProduct?.price}</span>
                <p className={styles.price_text}>{displayProduct?.quantity} | GST included</p>
              </div>

              <div className={styles.quantity}>
                <button onClick={decreaseQty}>-</button>
                <span>{quantity_demanded}</span>
                <button onClick={increaseQty}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.action_btn}>
              <button
                onClick={() => {
                  const result = onAddToCart({
                    router,
                    productId: displayProduct?._id,
                    session,
                    quantity_demanded,
                    variantId: selectedVariant?._id,
                  });
                  // onAddToCart may return a promise or object; keep original behavior
                  if (result?.success === false) {
                    toast.error("Unable To Add to Cart");
                  } else {
                    toast.success("Added To Cart");
                  }
                }}
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
                <InfinteScroller>
                  {displayProduct?.chooseUs?.map((item, idx) => (
                    <div className={styles.icon} key={idx}>
                      <Image src={item?.imageUrl} width={80} height={80} alt={item.text} title={item.text} />
                      <p>{item.text}</p>
                    </div>
                  ))}
                </InfinteScroller>
              </section>
            )}

            <Link href={`#product_info_tabs`}>
              <div className={styles.productInfoBtn}>
                Know More
              </div>
            </Link>

            <SuitableSection />
            <TopHighlights />
            <SpecSection />
            <DisclaimerSection />
          </div>
        </section>

        {/* Product Info Tabs */}
        <Tabs id={"product_info_tabs"} tabs={tabsObject} />

        <RenderBanners position={"mid"} banners={productData.banners} />

        {/* Reviews */}
        <section id="reviews">
          <ReviewSection reviews={displayProduct?.reviews} productId={productId} />
        </section>

        <RenderBanners position={"bottom"} banners={productData.banners} />
      </div>
    </>
  );
};

// ========== SSG ==========
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

  // Normalize image arrays server-side so initial render is consistent
  const normalizedProduct = {
    ...product,
    imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl : product.imageUrl ? [product.imageUrl] : [],
    variants: (product.variants || []).map((v) => ({
      ...v,
      imageUrl: Array.isArray(v.imageUrl) ? v.imageUrl : v.imageUrl ? [v.imageUrl] : [],
    })),
  };

  const normalizedProductInfo = productInfo || {};

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
