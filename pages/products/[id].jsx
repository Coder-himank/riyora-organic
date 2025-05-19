import Head from "next/head";
import dbConnect from "@/server/db";
import Image from "next/image";
import { useEffect, useState } from "react";
import Product from "@/server/models/Product";
import styles from "@/styles/productPage.module.css";
import { onAddToCart, onAddToWishlist, onBuy } from "@/components/ProductAction";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import getConfig from "next/config";
import Carousel from "@/components/Carousel";
import Link from "next/link";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";

const ExpandableSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);


    return (
        <div className={styles.expandable_section}>
            <h2 onClick={() => setIsOpen(!isOpen)} className={styles.expandable_title}>
                {title} {isOpen ? "-" : "+"}
            </h2>
            {isOpen && <div className={styles.expandable_content}>{children}</div>}
        </div>
    );
};

const ProductPage = ({ productId, productData }) => {
    if (!productId) {
        return <h1>Product not found</h1>;
    }

    const { publicRuntimeConfig } = getConfig()
    const site_url = publicRuntimeConfig.BASE_URL

    const { data: session } = useSession();
    const [notification, setNotification] = useState(null);
    // const [productData, setProductData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [quantity_demanded, setQuantityDemanded] = useState(1)
    const brand_name = "Organic Robust"

    const router = useRouter();
    const [productSchema, setProductSchema] = useState({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "image": [
            `${site_url}${productData.imageUrl}`
        ],
        "description": productData.description,
        "brand": {
            "@type": "Brand",
            "name": brand_name
        },
        "sku": "ORG-ALOE-001",
        "mpn": "123456",
        "identifier": {
            "@type": "PropertyValue",
            "propertyID": "GTIN",
            "value": "0123456789012"
        },
        "offers": {
            "@type": "Offer",
            "url": `${site_url}/products/${productId}`,

            "priceCurrency": "INR",
            "price": `${productData.price}`,
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": brand_name
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "56"
        },
        "review": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "John Doe"
                },
                "datePublished": "2025-01-15",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "reviewBody": "Amazing product! My skin feels so refreshed."
            }
        ]
    })
    const [uMayLikeProducts, setUMayLikeProducts] = useState([])



    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const resposne = await axios.get("/api/getProducts")
                console.log(resposne);
                if (resposne.status == 200) {
                    setUMayLikeProducts(resposne.data)
                    console.log(resposne.data);
                } else {
                    setUMayLikeProducts([])

                }
            } catch (e) {

                console.log(e)

            }

        }

        fetchRecommendedProducts()
    }, [])



    const newNotify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <>
            <Head>
                <title>{`${productData.name} | Organic Store`}</title>
                <meta name="description" content={productData.description} />
                <meta name="keywords" content={productData.keywords} />
                <meta name="author" content={brand_name} />
                <meta name="robots" content="index, follow" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="product" />
                <meta property="og:title" content={productData.name} />
                <meta property="og:description" content={productData.description} />
                <meta property="og:image" content={`${site_url}/${productData.imageUrl}`} />
                <meta property="og:url" content={site_url + "/products/" + productId} />
                <meta property="og:site_name" content={brand_name} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={productData.name} />
                <meta name="twitter:description" content={productData.description} />
                <meta name="twitter:image" content={`${site_url}/${productData.imageUrl}`} />
                <meta name="twitter:site" content={brand_name} />

                {/* Canonical URL (Language-Specific) */}
                <link rel="canonical" href={`${site_url}/products/${productId}`} />


                <link
                    rel="alternate"
                    hrefLang={"en"}
                    href={`${site_url}/products/${productId}`}
                />

                {/* Product Schema */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...productSchema, inLanguage: "en" }) }} />

            </Head>
            <div className="navHolder"></div>

            <div className={styles.product_container}>
                {notification && <div className="notification">{notification}</div>}
                {loading ? (<h1>Loading...</h1>) : error ? (<h1>Error : {error}</h1>) : (
                    <>
                        <h1>{productData.name}</h1>
                        <section className={styles.sec_1}>
                            <Image src={productData.imageUrl} width={350} height={400} alt={productData.name} />

                            <div className={styles.details}>
                                <div className={styles.sci_name}>{productData.scientificName}</div>
                                <div className={styles.oth_name}>
                                    {/* {t(`${productName}.otherNames`)} */}
                                </div>
                                <div className={styles.price}><strong>Price:</strong> ₹{productData.price}</div>
                                <div>Ratings: ⭐⭐⭐⭐☆</div>
                                <hr />
                                <div className={styles.description}>
                                    <p>{productData.description}</p>
                                </div>

                                <div className={styles.action_btn}>
                                    <button onClick={() => onAddToWishlist(router, productId, session).success == false ? newNotify("Unable to Add to Wishlist") : newNotify("Added To Wishlist")} className="button-outline ">Add To Wishlist</button>
                                    <button onClick={() => onAddToCart(router, productId, session).success == false ? newNotify("Unable To Add to Cart") : newNotify("Added To Cart")}>Add To Cart</button>
                                    <button onClick={() => onBuy(router, productId, quantity_demanded, session)}>Buy</button>
                                </div>
                                <hr />
                            </div>
                        </section>
                        <section>
                            <ExpandableSection title={"More Details"}>
                                <section className={styles.other_details}>
                                    <div>
                                        <strong>Ingredients</strong>  {
                                            productData.ingredients?.map((item) => { return item }).join(" | ")
                                        }
                                    </div>
                                    <div>
                                        <strong>Suitable For</strong>  {productData.suitableFor?.map((item) => { return item }).join(" | ")}
                                    </div>
                                    <div>
                                        <strong>Use With</strong> {productData.ingredientsToUseWith?.map((item) => { return item }).join(" | ")}
                                    </div>
                                    <div>
                                        {/* <strong>Category</strong> {productData.category?.map((item) => { return item }).join(" | ")} */}
                                        <strong>Category</strong> {productData.category}
                                    </div>
                                    <div>
                                        <strong>Time Period</strong> {productData.timeperiod}
                                    </div>
                                    <div className={styles.notes}>
                                        <strong>Note:</strong>
                                        <ul>
                                            {productData.note?.map((item) => { return <li>{item}</li> })}
                                        </ul>
                                    </div>
                                </section>
                            </ExpandableSection>
                            <hr />

                            <ExpandableSection title={"Benefits"}>
                                <h3 className={styles.detail_title}>For Hair</h3>
                                <p className={styles.detail_para}>{productData.benefits?.hair || "No data available."}</p>
                                <h3 className={styles.detail_title}>For Skin</h3>
                                <p className={styles.detail_para}>{productData.benefits?.skin || "No data available."}</p>
                                <h3 className={styles.detail_title}>For Health</h3>
                                <p className={styles.detail_para}>{productData.benefits?.health || "No data available."}</p>
                            </ExpandableSection>
                        </section>
                        <hr />
                        <section className="sec sec-2">
                            <ExpandableSection title={"How To Use"}>
                                <h3 className={styles.detail_title}>For Hair</h3>
                                <p className={styles.detail_para}>{productData.howToUse?.hair || "No data available."}</p>
                                <h3 className={styles.detail_title}>For Skin</h3>
                                <p className={styles.detail_para}>{productData.howToUse?.skin || "No data available."}</p>
                                <h3 className={styles.detail_title}>For Health</h3>
                                <p className={styles.detail_para}>{productData.howToUse?.health || "No data available."}</p>
                            </ExpandableSection>
                        </section>

                        <section className={styles.reviews}>
                            <div className={styles.review_card}>
                                <span>Name</span>
                                <span>review</span>
                            </div>
                        </section>

                    </>
                )}
            </div>

            <section className={styles.more_products}>
                <Carousel>
                    {uMayLikeProducts.length !== 0 &&
                        uMayLikeProducts.map((product, index) =>
                            <ProductCard key={product.name} product={product} />
                        )}
                </Carousel>
            </section>
        </>
    );
};

export async function getStaticPaths() {
    await dbConnect();
    const products = await Product.find({}, "_id"); // Fetch IDs only

    console.log("Fetched Products:", products); // Check structure

    let paths = [];



    paths = products.map((product) => ({
        params: { id: product._id?.toString() },
    }));

    console.log("Generated Paths:", paths);

    return {
        paths,
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {

    await dbConnect();
    const product = await Product.findById(params.id).lean(); // Fetch the product by ID


    return {
        props: {
            productId: params.id,
            productData: JSON.parse(JSON.stringify(product)), // Convert to JSON and back to object to remove MongoDB specific properties
        },
        revalidate: 10, // Revalidates every 10 minutes
    };
}

export default ProductPage;