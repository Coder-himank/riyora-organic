import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry, } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/reviewSection.module.css"
import { MultiImageUploader } from "@/components/ImageUploader";
export const ReviewSection = ({ productId, reviews = [] }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState("")
    const { data: session } = useSession();

    // Calculate average rating & distribution
    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return {
            star,
            count,
            percent: totalReviews ? (count / totalReviews) * 100 : 0,
        };
    });



    const smileOptions = [
        { value: 5, icon: <FaGrinStars />, label: "Excellent" },
        { value: 4, icon: <FaSmile />, label: "Good" },
        { value: 3, icon: <FaMeh />, label: "Average" },
        { value: 2, icon: <FaFrown />, label: "Poor" },
        { value: 1, icon: <FaAngry />, label: "Terrible" },
    ];



    // ======================Image Upload Function =============================
    // 
    const setReviewImage = (url) => {
        setImages((prev) => [...prev, ...url])
    }

    const removeReviewImage = (idx) => {

        setImages((prev) => prev.filter((p, index) => index === idx))
    }

    const handleSubmit = async () => {
        if (!rating || !comment) {
            toast.error("Please select a rating and write a review.");
            return;
        }

        if (!session || !session.user) {
            toast.error("Please Login...");
            return;
        }
        if (!productId || comment === "" || rating === 0) {
            toast.error("Empty inputs");
            return;
        }
        try {
            const response = await axios.post("/api/secure/feedback", {
                productId,
                name: session.user.name,
                userId: session.user.id,
                comment,
                images: images,
                rating: parseFloat(rating),
            });

            if (response.status === 201) {
                toast.success("Feedback submitted successfully");
                setRating(0);
                setComment("");
                setImages([])

                return response.data;
            } else {
                toast.error("Failed to submit feedback");
                return { success: false };
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <section className={styles.reviewSection} id="reviews">
            <h2>
                Customer <span>Reviews</span>
            </h2>

            <div className={styles.reviewContainer}>
                {/* Left Side: Ratings Summary */}
                <div className={styles.leftPanel}>
                    <h3>{averageRating.toFixed(1)} / 5</h3>
                    <p>Based on {totalReviews} reviews</p>

                    {distribution.map((d) => (
                        <div key={d.star} className={styles.ratingRow}>
                            <span>{d.star}★</span>
                            <div className={styles.progressBar}>
                                <div style={{ width: `${d.percent}%` }}></div>
                            </div>
                            <span>{d.count}</span>
                        </div>
                    ))}
                </div>

                {/* Right Side: Write a Review */}
                <div className={styles.rightPanel}>
                    <h3>Write Your Review</h3>
                    <div className={styles.smileOptions}>
                        {smileOptions.map((s) => (
                            <button
                                key={s.value}
                                className={`${styles.smileBtn} ${rating === s.value ? styles.active : ""}`}
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
                    ></textarea>

                    <MultiImageUploader
                        images={images}
                        setDataFunction={setReviewImage}
                        removeDataFunction={removeReviewImage}
                        fileFolder={`${productId}-reviews`}
                    />

                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        Submit Review
                    </button>
                </div>
            </div>

            {/* Bottom: Reviews List */}
            <div className={styles.reviewList}>
                <h3>What others are saying</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((r, i) => (
                        <div key={i} className={styles.reviewCard}>
                            <Image
                                src={"/images/user.png"}
                                width={50}
                                height={50}
                                alt="loda"
                                className={styles.userImage}
                            />
                            <div>
                                <div className={styles.reviewHeader}>
                                    <strong>{r.name || "Anonymous"}</strong>
                                    <span>{r.rating}★</span>
                                </div>
                                <p>{r.comment}</p>
                                {r.images && r.images.length > 0 && (

                                    <section className={styles.reviewImages}>
                                        {/* Images */}

                                        {r.images.map((img, index) => (
                                            <Image src={img} alt={`Image Review ${index}`} width={150} height={150} />
                                        ))}
                                    </section>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ReviewSection;