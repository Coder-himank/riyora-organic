import styles from "@/styles/reviewCard.module.css";
import Image from "next/image";
import StarRating from "@/components/StartRating";
export const ReviewCard = ({ review }) => {

    if (!review) {
        review = {
            imageUrl: "/images/person1.jpg",
            name: "Customer",
            date: "Date",
            text: "Best Products",
            rating: 4.5
        }
    }
    return (

        <div className={styles.review_card}>
            <div>
                <Image src={review.imageUrl || "/images/person1.jpg"} alt="Person face" width={200} height={200} />
            </div>
            <div className={styles.review_info}>
                <section>{review.name || "Customer"}</section>
                <section>
                    <StarRating rating={review.rating || 5} />
                </section>
                {/* <section>
                    <p>{review.date || "Date"}</p>
                </section> */}
                <section>
                    <p>{review.text || "Best Products"}</p>
                </section>
            </div>
        </div>
    )
}

export default ReviewCard;
