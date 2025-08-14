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
import { motion } from "framer-motion";
import StarRating from "@/components/StartRating";


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
            `${site_url}${productData.imageUrl[0]}`
        ],
        "description": productData.description,
        "brand": {
            "@type": "Brand",
            "name": brand_name
        },
        "sku": "ORG-ALOE-001",
        "mpn": "123456",
        "gtin13": "0123456789012",
        "offers": {
            "@type": "Offer",
            "url": `${site_url}${productId}`,

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
            "ratingValue": productData.averageRating,
            "reviewCount": productData.numReviews
        },

        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 2,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",

        }

    })
    const [uMayLikeProducts, setUMayLikeProducts] = useState([])
    const [isHydrated, setIsHydrated] = useState(false);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [saveComment, setSaveComment] = useState(null);
    const [productReviews, setProductReviews] = useState(productData.reviews)

    useEffect(() => {
        if (!productData || !productReviews) return;

        setProductSchema({
            ...productSchema,
            review: productReviews.map((review) => ({
                "@type": "Review",
                author: { "@type": "Person", name: review.name },
                datePublished: new Date().toISOString().split("T")[0],
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: review.rating,
                    bestRating: "5"
                },
                reviewBody: review.comment
            }))
        });
    }, [productReviews]);


    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                const resposne = await axios.get("/api/getProducts")
                // console.log(resposne);
                if (resposne.status == 200) {
                    setUMayLikeProducts(resposne.data)
                    // console.log(resposne.data);
                } else {
                    setUMayLikeProducts([])

                }
            } catch (e) {

                console.log(e)

            }

        }

        setIsHydrated(true);

        fetchRecommendedProducts()
    }, [])


    const ReviewCard = ({ review, index }) => {
        return (
            <motion.div
                className={styles.review_card}
                key={index}
                initial={{ x: 0, y: 0, opacity: 0.3 }}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1.5 }}
                viewport={{ once: true }}
            >
                <div>
                    <Image
                        src={review?.imageUrl || "/images/person1.jpg"}
                        alt="Person face"
                        width={200}
                        height={200}
                    />
                </div>
                <div className={styles.review_info}>
                    <section>{review?.name || "Customer"}</section>
                    <section>
                        <StarRating rating={review?.rating || 0} />
                    </section>
                    <section>
                        <p>{review?.comment || "Best Products"}</p>
                    </section>
                </div>
            </motion.div>
        );
    };


    const newFeedback = async () => {
        if (!session || !session.user) {
            newNotify("Please Login...")
            return
        }
        if (!productId || comment === "" || rating === 0) {
            newNotify("Empty inputs")
            return
        }
        try {
            const response = await axios.post("/api/secure/feedback", {
                productId,
                name: session.user.name,
                userId: session.user.id,
                comment,
                rating: parseFloat(rating)
            });

            if (response.status === 201) {
                newNotify("Feedback submitted successfully");
                setComment("")
                setRating(0)
                setSaveComment(false)
                // console.log(response.data);

                setProductReviews([{
                    name: session.user.name,
                    userId: session.user.id,
                    comment,
                    rating
                }, ...productReviews])

                return response.data;
            } else {
                newNotify("Failed to submit feedback");
                return { success: false };
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    }


    const newNotify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2000);
    };

    if (!isHydrated) {
        return <h1>Loading...</h1>;
    }

    const choose_us_list_1 = [
        { img: "/images/choose_us_icon_1.png", text: "Cruelty Free" },
        { img: "/images/choose_us_icon_2.png", text: "Eco Friendly" },
        { img: "/images/choose_us_icon_3.png", text: "Non Sticky" },
        { img: "/images/choose_us_icon_4.png", text: "Vegan" },
        { img: "/images/choose_us_icon_5.png", text: "No Artificial Color" },
    ]

    // console.log("Product Data:", productData.imageUrl);


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
                <meta property="og:image" content={`${site_url}${productData.imageUrl[0]}`} />
                <meta property="og:url" content={site_url + "/products/" + productId} />
                <meta property="og:site_name" content={brand_name} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={productData.name} />
                <meta name="twitter:description" content={productData.description} />
                <meta name="twitter:image" content={`${site_url}${productData.imageUrl[0]}`} />
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
                    <div>
                        <section className={styles.sec_1}>
                            <section className={styles.carousel}>

                                <Carousel action_style="images">
                                    {productData.imageUrl.map((image, index) => (

                                        <Image key={index} src={image} width={500} height={500} alt={productData.name} />

                                    ))}

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
                                    <StarRating rating={productData.averageRating} />
                                    <span>({productData.numReviews})</span>
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
                                        <div className={styles.price_display}>

                                            {productData.discountPercentage && (
                                                <>
                                                    <span className={styles.discount_perc}>{productData.discountPercentage}% OFF</span>
                                                    <span className={styles.originalPrice}>₹{productData.price}</span>
                                                </>
                                            )}
                                            <span className={styles.salePrice}>₹{Math.ceil(productData.price - ((productData.discountPercentage / 100) * productData.price))}</span>
                                        </div>
                                        <div className={styles.price_text}>
                                            <p>+gst and delivery chrages</p>
                                        </div>
                                    </div>
                                    <div className={styles.quantity}>
                                        <button onClick={() => setQuantityDemanded((q) => q - 1 !== 0 ? q - 1 : 1)}>-</button>
                                        <span>{quantity_demanded}</span>
                                        <button onClick={() => setQuantityDemanded(quantity_demanded + 1)}>+</button>
                                    </div>
                                </div>


                                <section className={styles.icons}>
                                    {choose_us_list_1.map((item, index) => (
                                        <Image
                                            src={item.img}
                                            width={80}
                                            height={80}
                                            alt={item.text}
                                        />
                                    ))}
                                </section>

                                <div className={styles.action_btn}>

                                    <button onClick={() => onAddToCart(router, productId, session).success == false ? newNotify("Unable To Add to Cart") : newNotify("Added To Cart")}>Add To Cart</button>
                                    <button onClick={() => onBuy(router, productId, quantity_demanded, session)}>Buy Now</button>
                                </div>

                                <div className={styles.variants}>
                                    {productData.variants.map((variant, index) => (<Link href={"/"} className={styles.variant_card}>
                                        <Image src={productData.imageUrl[0]} width={100} height={100} alt="Product Image" />
                                        <div className={styles.variant_text}>
                                            <span>{variant.name}</span>
                                            <span className={styles.variant_price}>₹{variant.price}</span>
                                        </div>
                                    </Link>
                                    ))}
                                </div>

                                <div className={styles.more_information}>
                                    {productData.details && (

                                        Object.entries(productData.details).map(([key, value]) => (
                                            <div className={styles.moreDetails}>
                                                <strong>{key}</strong>
                                                <p>

                                                    {
                                                        Array.isArray(value)
                                                            ? value.join(", ")
                                                            : typeof value === "boolean"
                                                                ? value ? "Yes" : "No"
                                                                : value
                                                    }
                                                </p>
                                            </div>

                                        ))

                                    )}
                                </div>


                            </div>
                        </section>

                        <section>
                            <h2>Suitable <span>For</span></h2>
                            <div className={styles.suitable_cards}>
                                {Array.from({ length: 6 }).map((_, index) => (<>
                                    <div className={styles.suitable_images} key={index}>
                                        <Image src={`/images/suitable_${index + 1}.png`} width={300} height={300} alt="Image" />
                                        <p>Helps in reducing </p>
                                    </div>
                                </>))}
                            </div>
                        </section>



                        <section>
                            <h2>How <span>to  Apply</span></h2>
                            <div className={styles.apply_section}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div className={styles.apply_box} key={index}>
                                        <Image src={"/images/pouring_oil.jpg"} width={300} height={300} />
                                        <div>
                                            <h4>Step {index}</h4>

                                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus reprehenderit corrupti alias eos quo.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2>Customer <span>Feedback</span></h2>
                            <div className={styles.customer_feedback}>
                                <div className={styles.rating_div_1}>
                                    <div className={styles.rate_score}>
                                        {productData.averageRating.toFixed(1)} / 5
                                    </div>
                                    <div className={styles.rate_stars}>
                                        <StarRating rating={productData.averageRating} />
                                    </div>
                                </div>
                                <div className={styles.rating_div_2}>
                                    <div className={styles.rating_div_2_in}>
                                        {productReviews.map((review, index) => (
                                            <ReviewCard key={index} review={review} index={index} />
                                        ))
                                        }
                                    </div>
                                </div>
                                <div className={styles.rating_div_3} >
                                    <div className={styles.comment_field} style={{ width: (saveComment ? 0 : "100%") }}>

                                        <input type="text" placeholder="Write Your Feed Back...." onChange={(e) => setComment(e.target.value)} />
                                        <button onClick={() => setSaveComment(true)}>Next</button>
                                    </div>
                                    <div className={styles.rate_field}>
                                        <button onClick={() => setSaveComment(false)}>Prev</button>
                                        <input type="number" min={1} max={5} step={0.5} value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} />

                                        <button onClick={newFeedback}>Submit</button>
                                    </div>
                                </div>
                            </div>
                            {/* {saveComment} */}
                        </section>



                    </div >
                )}
            </div >
        </>
    );
};

export async function getStaticPaths() {
    await dbConnect();
    const products = await Product.find({}, "_id"); // Fetch IDs only

    // console.log("Fetched Products:", products); // Check structure

    let paths = [];



    paths = products.map((product) => ({
        params: { id: product._id?.toString() },
    }));

    // console.log("Generated Paths:", paths);

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