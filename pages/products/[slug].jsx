// pages/products/[slug].jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "next/config";
import dbConnect from "@/server/db";

import Product from "@/server/models/Product";
import ProductInfo from "@/server/models/productInfo";

import RenderBanners from "@/components/RenderBanners";

import ProductGallery from "@/components/ProductPage/ProductGallery";
import ProductHeader from "@/components/ProductPage/ProductHeader";
import VariantSelector from "@/components/ProductPage/VariantSelector";
import PriceBlock from "@/components/ProductPage/PriceBlock";
import Actions from "@/components/ProductPage/Actions";
import ChooseUsScroller from "@/components/ProductPage/ChooseUsScrolller";

import SpecSection from "@/components/ProductPage/Sections/SpecSection";
import DisclaimerSection from "@/components/ProductPage/Sections/DisclaimerSection";
import SuitableSection from "@/components/ProductPage/Sections/SuitableSection";
import TopHighlights from "@/components/ProductPage/Sections/TopHighlights";

import DescriptionTab from "@/components/ProductPage/Tabs/DescriptionTab";
import IngredientsTab from "@/components/ProductPage/Tabs/IngredientTab";
import BenefitsTab from "@/components/ProductPage/Tabs/BenefitsTab";
import HowToUseTab from "@/components/ProductPage/Tabs/HowToUseTab";

import Tabs from "@/components/Tabs";
import ReviewSection from "@/components/ReviewSection";
import { onAddToCart } from "@/components/ProductAction";

import buildProductSchema from "@/utils/products/buildProductSchema";
import { normalizeVariantImages } from "@/utils/utils";

import styles from "@/styles/productPage.module.css";
import { ToastContainer, toast } from "react-toastify";

export default function ProductPage({ productId, pdata, pInfodata, productSchema }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const site_url = publicRuntimeConfig.BASE_URL;

  const [productData, setProductData] = useState(pdata);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity_demanded, setQuantityDemanded] = useState(1);

  if (!productId || !productData) return <h1>Loading...</h1>;

  /** Variant selection logic (same as before) */
  useEffect(() => {
    if (!productData) return;

    const queryVariant = router.query.variantId;

    if (productData.variants?.length) {
      const found = productData.variants.find(v => String(v._id) === String(queryVariant));
      if (found && found._id !== selectedVariant?._id) setSelectedVariant(found);
    } else if (!selectedVariant) {
      setSelectedVariant(null);
    }
  }, [router.query.variantId, productData]);

  /** Compose final displayProduct */
  const displayProduct = selectedVariant
    ? {
      ...productData,
      price: selectedVariant.price ?? productData.price,
      mrp: selectedVariant.mrp ?? productData.mrp,
      stock: selectedVariant.stock ?? productData.stock,
      sku: selectedVariant.sku ?? productData.sku,
      quantity: selectedVariant.quantity ?? productData.quantity,
      imageUrl:
        normalizeVariantImages(selectedVariant).length > 0
          ? normalizeVariantImages(selectedVariant)
          : productData.imageUrl,
      name: selectedVariant.name || productData.name,
    }
    : productData;

  /** Fetch updated product (same logic) */
  useEffect(() => {
    let cancelled = false;
    async function fetchLive() {
      try {
        const res = await axios.get(`/api/getProducts?productId=${productId}`);
        if (!cancelled && res.status === 200) {
          if (JSON.stringify(res.data[0]) !== JSON.stringify(productData)) {
            setProductData(res.data[0]);
          }
        }
      } catch (e) {
        console.error("Live fetch error:", e);
      }
    }
    fetchLive();
    return () => (cancelled = true);
  }, [productId]);


  /** Quantity controls */
  const dec = () => setQuantityDemanded(q => (q > 1 ? q - 1 : 1));
  const inc = () => setQuantityDemanded(q => (q < 5 ? q + 1 : 5));

  /** Add to cart */
  const handleAddToCart = async () => {
    const result = await onAddToCart({
      router,
      session,
      quantity_demanded,
      productId: displayProduct._id,
      variantId: selectedVariant?._id,
    });
    if (result?.success) toast.success("Added To Cart");
    else toast.error("Unable To Add To Cart");
  };

  /** Tabs object */
  const tabsObject = {
    Description: <DescriptionTab pInfodata={pInfodata} />,
    Ingredients: <IngredientsTab pInfodata={pInfodata} />,
    Benefits: <BenefitsTab pInfodata={pInfodata} />,
    "How To Use": <HowToUseTab product={displayProduct} />,
  };

  return (
    <>
      <Head>
        <title>{`${displayProduct.name} | ${displayProduct.brand}`}</title>
        <meta name="description" content={displayProduct.description?.slice(0, 160)} />
        <link rel="canonical" href={`${site_url}/products/${displayProduct.slug}`} />


        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
        )}

      </Head>

      <ToastContainer autoClose={2500} />

      <RenderBanners position="top" banners={productData.banners} />

      <div className={styles.product_container}>
        <section className={styles.sec_1}>
          <ProductGallery images={displayProduct.imageUrl} />

          <div className={styles.details}>
            <ProductHeader product={displayProduct} />

            <div className={styles.description}>
              <Link href="#product_info_tabs">
                <p>
                  {displayProduct.description.length > 300
                    ? displayProduct.description.slice(0, 300) + "..."
                    : displayProduct.description}
                </p>
              </Link>
            </div>

            {productData.variants?.length > 0 && (
              <VariantSelector
                product={productData}
                selectedVariant={selectedVariant}
                router={router}
                setSelected={setSelectedVariant}
              />
            )}

            <PriceBlock
              product={displayProduct}
              qty={quantity_demanded}
              increaseQty={inc}
              decreaseQty={dec}
            />

            <Actions
              handleAdd={handleAddToCart}
              product={displayProduct}
              qty={quantity_demanded}
              router={router}
              session={session}
              selectedVariant={selectedVariant}
            />

            <ChooseUsScroller chooseUs={displayProduct.chooseUs} />

            <SuitableSection product={displayProduct} />
            <TopHighlights product={displayProduct} />
            <SpecSection product={displayProduct} />
            <DisclaimerSection product={displayProduct} />

            <Link href="#product_info_tabs">
              <div className={styles.productInfoBtn}>Know More</div>
            </Link>
          </div>
        </section>

        {/* Tabs */}
        <Tabs id="product_info_tabs" tabs={tabsObject} />

        <RenderBanners position="mid" banners={productData.banners} />

        <section id="reviews">
          <ReviewSection reviews={displayProduct.reviews} productId={productId} />
        </section>

        <RenderBanners position="bottom" banners={productData.banners} />
      </div>
    </>
  );
}

/* -------------------- SSG -------------------- */
export async function getStaticPaths() {
  await dbConnect();
  const prods = await Product.find({ visible: true }, "slug");
  return {
    paths: prods.map(p => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();
  const productInfo = await ProductInfo.findOne({ slug: params.slug }).lean();

  if (!product) return { notFound: true };

  const normalizedProduct = {
    ...product,
    imageUrl: Array.isArray(product.imageUrl)
      ? product.imageUrl
      : product.imageUrl ? [product.imageUrl] : [],
    variants: (product.variants || []).map(v => ({
      ...v,
      imageUrl: Array.isArray(v.imageUrl)
        ? v.imageUrl
        : v.imageUrl ? [v.imageUrl] : [],
    })),
  };

  const productSchema = buildProductSchema(
    normalizedProduct,
    process.env.BASE_URL || "https://riyoraorganic.com"
  );

  return {
    props: {
      productId: product._id.toString(),
      pdata: JSON.parse(JSON.stringify(normalizedProduct)),
      pInfodata: JSON.parse(JSON.stringify(productInfo || {})),
      productSchema: JSON.parse(JSON.stringify(productSchema)),
    },
    revalidate: 600,
  };
}