import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/reviewSection.module.css";
import { MultiImageUploader } from "@/components/ImageUploader";

export const ReviewSection = ({ productId, reviews = [] }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const { data: session } = useSession();
    const [submitting, setSubmitting] = useState(false);

    // Modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [lightboxType, setLightboxType] = useState("image"); // image or video

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
            return
        }
        if (!session || !session.user) {
            toast.error("Please login to submit a review.");
            return;
        }

        console.log("submiting review", { rating, comment, images });
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
                return response.data;
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

    const topReviews = reviews.slice().sort((a, b) => b.rating - a.rating).slice(0, 4);
    const latestReviews = reviews.slice(-3).reverse();

    // Lightbox open
    const openLightbox = (src, type) => {
        setLightboxSrc(src);
        setLightboxType(type);
        setLightboxOpen(true);
    };

    return (
        <section className={styles.reviewSection} id="reviews">
            <h2>Customer <span>Reviews</span></h2>

            <div className={styles.reviewContainer}>
                {/* Ratings Summary */}
                <div className={styles.leftPanel}>
                    <h3>{averageRating.toFixed(1)} / 5</h3>
                    <p>Based on {totalReviews} reviews</p>
                    {distribution.map((d) => (
                        <div key={d.star} className={styles.ratingRow}>
                            <span>{d.star}★</span>
                            <div className={styles.progressBar}><div style={{ width: `${d.percent}%` }} /></div>
                            <span>{d.count}</span>
                        </div>
                    ))}
                </div>

                {/* Write Review */}
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
                                {s.icon}<span>{s.label}</span>
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
                    />

                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>

            {/* Reviews */}
            <div className={styles.reviewList}>
                {latestReviews.map((r, i) => (
                    <div key={i} className={styles.reviewCard}>
                        <Image src="/images/user.png" width={50} height={50} alt="user" className={styles.userImage} />
                        <div>
                            <div className={styles.reviewHeader}>
                                <strong>{r.name || "Anonymous"}</strong>
                                <span>{r.rating}★</span>
                            </div>
                            <p>{r.comment}</p>
                            {r.images?.length > 0 && (
                                <section className={styles.reviewImages}>
                                    {r.images.map((media, idx) => {
                                        const isVideo = media.endsWith(".mp4") || media.endsWith(".mov") || media.endsWith(".webm");
                                        return isVideo ? (
                                            <video
                                                key={idx}
                                                width={150}
                                                height={150}
                                                onClick={() => openLightbox(media, "video")}
                                                style={{ cursor: "pointer" }}
                                                controls={false}
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
                                    })}
                                </section>
                            )}
                        </div>
                    </div>
                ))}

                {topReviews.map((r, i) => (
                    <div key={i} className={styles.reviewCard}>
                        <Image src="/images/user.png" width={50} height={50} alt="user" className={styles.userImage} />
                        <div>
                            <div className={styles.reviewHeader}>
                                <strong>{r.name || "Anonymous"}</strong>
                                <span>{r.rating}★</span>
                            </div>
                            <p>{r.comment}</p>
                            {r.images?.length > 0 && (
                                <section className={styles.reviewImages}>
                                    {r.images.map((media, idx) => {
                                        const isVideo = media.endsWith(".mp4") || media.endsWith(".mov") || media.endsWith(".webm");
                                        return isVideo ? (
                                            <video
                                                key={idx}
                                                width={150}
                                                height={150}
                                                onClick={() => openLightbox(media, "video")}
                                                style={{ cursor: "pointer" }}
                                                controls={false}
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
                                    })}
                                </section>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className={styles.lightboxOverlay}
                    onClick={() => setLightboxOpen(false)}
                >
                    <div className={styles.lightboxContent}>
                        {lightboxType === "image" ? (
                            <img src={lightboxSrc} alt="Preview" />
                        ) : (
                            <video src={lightboxSrc} controls autoPlay />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReviewSection;
