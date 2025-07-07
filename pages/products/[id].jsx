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
import { FaArrowRight, FaStar, FaRegStar } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";

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
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "50",
                    "currency": "INR"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "IN"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "d"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 3,
                        "maxValue": 5,
                        "unitCode": "d"
                    }
                }
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
        ],
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",

        }

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
                        <section className={styles.sec_1}>
                            <section className={styles.carousel}>

                                <Carousel>
                                    <Image src={productData.imageUrl} width={350} height={400} alt={productData.name} />
                                    <Image src={productData.imageUrl} width={350} height={400} alt={productData.name} />
                                    <Image src={productData.imageUrl} width={350} height={400} alt={productData.name} />
                                </Carousel>
                            </section>

                            <div className={styles.details}>

                                <div className={styles.paths}>
                                    <Link href={"/"}>Home</Link>
                                    <span>/</span>
                                    <Link href={"/products"}>Products</Link>
                                    <span>/</span>
                                    <Link href={`/products/${productData._id}`}>{productData.name}</Link>
                                </div>
                                <div className={styles.product_name}><h1>{productData.name}</h1></div>

                                <div className={styles.ratings}>
                                    <span><FaStar /></span>
                                    <span><FaStar /></span>
                                    <span><FaStar /></span>
                                    <span><FaStar /></span>

                                    <span><FaRegStar /></span>
                                    <span>(1470)</span>
                                </div>

                                <div className={styles.description}>
                                    <p>{productData.description || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem, vel a. Deleniti molestiae vitae temporibus deserunt dolor expedita accusantium cupiditate odit. Commodi sed quia modi, sequi ullam officia beatae voluptate!"}</p>
                                </div>

                                <div className={styles.quick_links}>

                                    <ul>
                                        <li><Link href={"/"}>Check Suitability</Link></li>
                                        <li><Link href={"/"}>More Information</Link></li>
                                        <li><Link href={"/"}>Customer Feedback</Link></li>
                                        <li><Link href={"/"}>How to Apply</Link></li>
                                        <li><Link href={"/"}>More details</Link></li>
                                    </ul>
                                </div>
                                <div className={styles.price_quantity}>
                                    <div className={styles.price}>
                                        <span className={styles.originalPrice}>₹{productData.price}</span>
                                        <span className={styles.salePrice}>₹{productData.price}</span>
                                    </div>
                                    <div className={styles.quantity}>
                                        <button onClick={() => setQuantityDemanded((q) => q - 1 !== 0 ? q - 1 : 1)}>-</button>
                                        <span>{quantity_demanded}</span>
                                        <button onClick={() => setQuantityDemanded(quantity_demanded + 1)}>+</button>
                                    </div>
                                </div>

                                <div className={styles.action_btn}>

                                    <button onClick={() => onAddToCart(router, productId, session).success == false ? newNotify("Unable To Add to Cart") : newNotify("Added To Cart")}>Add To Cart</button>
                                    <button onClick={() => onBuy(router, productId, quantity_demanded, session)}>Buy Now</button>
                                </div>

                                <div className={styles.variants}>
                                    <Link href={"/"} className={styles.variant_card}>
                                        <Image src={productData.imageUrl} width={70} height={70} alt={productData.name} />
                                        <div className={styles.variant_text}>
                                            <span>100ml for</span>
                                            <span className={styles.variant_price}>₹800</span>
                                        </div>
                                    </Link>
                                    <Link href={"/"} className={styles.variant_card}>
                                        <Image src={productData.imageUrl} width={70} height={70} alt={productData.name} />
                                        <div className={styles.variant_text}>
                                            <span>200ml for</span>
                                            <span className={styles.variant_price}>₹1500</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2>Suitable <span>For</span></h2>
                            <div className={styles.suitable_cards}>
                                {Array.from({ length: 6 }).map((_, index) => (<>
                                    <div className={styles.suitable_images}>
                                        <Image src={"/"} width={300} height={300} alt="Suitable 1" />
                                        <span>Problem</span>
                                    </div>
                                </>))}
                            </div>
                        </section>
                        <section>
                            <h2>More <span>Information</span></h2>
                            <div className={styles.more_information}>

                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div>
                                        <span>key</span>
                                        <p>Value</p>
                                    </div>
                                ))}
                            </div>

                        </section>
                        <section>
                            <h2>Customer <span>Feedback</span></h2>
                            <div className={styles.customer_feedback}>
                                <div className={styles.rating_div_1}>
                                    <div className={styles.rate_score}>
                                        4.8 / 5
                                    </div>
                                    <div className={styles.rate_stars}>
                                        <span><FaStar /></span>
                                        <span><FaStar /></span>
                                        <span><FaStar /></span>
                                        <span><FaStar /></span>
                                        <span><FaRegStar /></span>
                                    </div>
                                </div>
                                <div className={styles.rating_div_2}>
                                    <div className={styles.rating_div_2_in}>


                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <ReviewCard />
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.rating_div_3}>

                                    <input type="text" placeholder="Write Your Feed Back...." />
                                    <button>Submit</button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2>How <span>to  Apply</span></h2>
                            <div className={styles.apply_section}>

                                <div className={styles.apply_box}>
                                    <Image src={"/"} width={300} height={300} />
                                    <div>
                                        <h4>Step {0}</h4>

                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reprehenderit corrupti alias eos quo, inventore, possimus iure explicabo illum ratione temporibus atque soluta culpa excepturi facere! Ut quas asperiores magnam.</p>
                                    </div>
                                </div>
                                {Array.from({ lenght: 3 }).map((_, index) => (
                                    <div className={styles.apply_box}>
                                        <Image src={"/"} width={300} height={300} />
                                        <div>
                                            <h4>Step {index}</h4>

                                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reprehenderit corrupti alias eos quo, inventore, possimus iure explicabo illum ratione temporibus atque soluta culpa excepturi facere! Ut quas asperiores magnam.</p>
                                        </div>
                                    </div>
                                ))}
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