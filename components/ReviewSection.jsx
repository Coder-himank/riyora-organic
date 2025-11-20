import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/reviewSection.module.css";
import StarRating from "./StartRating";
import { MultiImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/router";

export const ReviewSection = ({ productId, reviews = [] }) => {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [canWriteReview, setCanWriteReview] = useState(true);
    const [filtered, setFiltered] = useState(0)
    const [uploadingImage, setUploadingImage] = useState(false);

    const router = useRouter();

    // Show/Hide All Reviews Box
    const [showReviewLimit, setShowReviewLimit] = useState(5);

    // Modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [lightboxType, setLightboxType] = useState("image");

    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return { star, count, percent: totalReviews ? (count / totalReviews) * 100 : 0 };
    });

    const smileOptions = [
        { value: 1, icon: <FaAngry />, label: "Terrible", color: "#F44336" },
        { value: 2, icon: <FaFrown />, label: "Poor", color: "#FF9800" },
        { value: 3, icon: <FaMeh />, label: "Average", color: "#FFC107" },
        { value: 4, icon: <FaSmile />, label: "Good", color: "#8BC34A" },
        { value: 5, icon: <FaGrinStars />, label: "Excellent", color: "#4CAF50" },
    ];

    // ✅ Fix canWriteReview logic
    useEffect(() => {
        if (!session) {
            setCanWriteReview(false);
            return;
        }

        const hasReviewed = reviews.some((r) => r.userId === session.user.id);
        // Can write only if NOT reviewed yet
        setCanWriteReview(!hasReviewed);
    }, [session, reviews]);

    const setReviewImage = (urls) => {
        if (Array.isArray(urls)) setImages((prev) => [...prev, ...urls]);
        else setImages((prev) => [...prev, urls]);
    };

    const removeReviewImage = (idx) => {
        setImages((prev) => prev.filter((_, index) => index !== idx));
    };

    const handleSubmit = async () => {
        if (!rating || !comment) {
            toast.error("Please select a rating and write a review.");
            return;
        }
        if (!session || !session.user) {
            toast.error("Please login to submit a review.");
            return;
        }

        if (uploadingImage) {
            toast.error("Please wait for image upload to complete.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await axios.post("/api/secure/feedback", {
                productId,
                name: session.user.name,
                userId: session.user.id,
                comment,
                images,
                rating: parseFloat(rating),
            });

            if (response.status === 201) {
                toast.success("Feedback submitted successfully");
                setRating(0);
                setComment("");
                setImages([]);
                setCanWriteReview(false); // user just reviewed
            } else {
                toast.error("Failed to submit feedback");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error submitting feedback");
        } finally {
            setSubmitting(false);
        }
    };


    const filterReviewByRate = (rate) => {
        setFiltered(rate);
        setDisplayReviews(rate === 0 ? orderedReviews : orderedReviews.filter(r => r.rating === rate));
        setShowReviewLimit(5);

        requestAnimationFrame(() => {
            const element = document.getElementById("reviewList");
            if (element) element.scrollIntoView({ behavior: "smooth" });
        });
    };


    // ✅ Sort reviews so newest first
    const sortedReviews = [...reviews].reverse();

    // ✅ If user already reviewed, put their review at the top
    const userReview = session
        ? sortedReviews.find((r) => r.userId === session.user.id)
        : null;
    const otherReviews = userReview
        ? sortedReviews.filter((r) => r.userId !== session.user.id)
        : sortedReviews;
    const orderedReviews = userReview ? [userReview, ...otherReviews] : sortedReviews;

    const [displayReviews, setDisplayReviews] = useState(orderedReviews)

    // Lightbox open
    const openLightbox = (src, type) => {
        setLightboxSrc(src);
        setLightboxType(type);
        setLightboxOpen(true);
    };

    const formatdate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
        });

        return formattedDate
    }

    const renderMedia = (media, idx) => {
        const isVideo = /\.(mp4|mov|webm)$/i.test(media);
        return isVideo ? (
            <video
                key={idx}
                width={150}
                height={150}
                onClick={() => openLightbox(media, "video")}
                style={{ cursor: "pointer" }}
                controls={false}
                autoPlay
                muted
            >
                <source src={media} type="video/mp4" />
            </video>
        ) : (
            <Image
                key={idx}
                src={media}
                alt={`Review Media ${idx}`}
                width={150}
                height={150}
                onClick={() => openLightbox(media, "image")}
                style={{ cursor: "pointer" }}
            />
        );
    };

    return (
        <section className={styles.reviewSection} id="reviews">

            <ToastContainer position="top-right" autoClose={3000} />
            <h2>
                Customer <span>Reviews</span>
            </h2>

            <div className={styles.reviewContainer}>
                {/* Ratings Summary */}
                <div className={styles.leftPanel}>
                    <h3>{averageRating.toFixed(1)} / 5</h3>
                    <p>Based on {totalReviews} reviews</p>
                    {distribution.map((d) => (
                        <div key={d.star} className={styles.ratingRow}
                            onClick={() => filterReviewByRate(d.star)}
                            role="button"
                            tabIndex={0}
                        >
                            <span>{d.star}★</span>
                            <div className={styles.progressBar}>
                                <div style={{ width: `${d.percent}%` }} />
                            </div>
                            <span>{d.count}</span>
                        </div>
                    ))}
                </div>

                {/* Right Panel */}

                <div className={styles.rightPanel}>
                    <h3>Write Your Review</h3>
                    <div className={styles.smileOptions}>
                        {smileOptions.map((s) => (
                            <button
                                key={s.value}
                                className={`${styles.smileBtn} ${rating === s.value ? styles.active : ""}`}
                                style={{ color: s.color }}
                                onClick={() => setRating(s.value)}
                            >
                                {s.icon}
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <MultiImageUploader
                        images={images}
                        setDataFunction={setReviewImage}
                        removeDataFunction={removeReviewImage}
                        fileFolder={`${productId}-reviews`}
                        setUploadingImage={setUploadingImage}
                        uploadingImage={uploadingImage}
                    />

                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>

            </div>

            {/* Reviews */}
            <div className={styles.reviewList} id="reviewList">
                <h3
                    onClick={() => {
                        setFiltered(0)
                        filterReviewByRate(0)
                        setShowReviewLimit(5)
                    }}
                >{!filtered ? "Recent Reviews" : "Showing results for " + filtered + " star reviews. Tap to reset"}</h3>
                {displayReviews.length === 0 && <p>No reviews yet.</p>}
                {displayReviews.slice(0, showReviewLimit).map((r, i) => (
                    <div key={i} className={styles.reviewCard}>
                        <Image
                            src="/images/user.png"
                            width={50}
                            height={50}
                            alt="user"
                            className={styles.userImage}
                        />
                        <div>
                            <div className={styles.reviewHeader}>
                                <span className={styles.customersRating}><StarRating rating={r.rating} /></span>
                                <strong className={styles.customersName}>{r.name || "Anonymous"}</strong>
                                {/* <span className={styles.reviewDate}>{formatdate(r.createdAt)}</span> */}
                            </div>
                            <p>{r.comment}</p>
                            {r.images?.length > 0 && (
                                <section className={styles.reviewImages}>
                                    {r.images.map((m, idx) => renderMedia(m, idx))}
                                </section>
                            )}

                            {r.replies.length > 0 ? (
                                <div className={styles.replyList}>
                                    {
                                        r.replies.map((reply, replyIdx) => (


                                            <div key={replyIdx} className={styles.reply}>
                                                <strong>{reply.name}</strong>
                                                <span>{formatdate(reply.createdAt)}</span>
                                                <p><span>@{r.name}</span> {reply.comment}</p>
                                            </div>
                                        )
                                        )
                                    }
                                </div>
                            ) : (<></>)
                            }

                        </div>

                    </div>
                ))}
            </div>

            {/* See All Reviews Button */}
            {
                showReviewLimit < displayReviews.length ? (
                    <button
                        className={styles.showAllBtn}
                        onClick={() => setShowReviewLimit((prev) => prev + 10)}
                    >
                        Show More
                    </button>
                ) : displayReviews.length > 5 && (
                    <button
                        className={styles.showAllBtn}
                        onClick={() => setShowReviewLimit(5)}
                    >
                        Hide All
                    </button>
                )
            }

            {/* Lightbox */}
            {
                lightboxOpen && (
                    <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
                        <div className={styles.lightboxContent}>
                            {lightboxType === "image" ? (
                                <img src={lightboxSrc} alt="Preview" />
                            ) : (
                                <video src={lightboxSrc} controls autoPlay />
                            )}
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default ReviewSection;
