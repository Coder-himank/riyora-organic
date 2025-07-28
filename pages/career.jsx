import styles from "@/styles/career.module.css"
import Link from "next/link";
export const career = () => {
    return (
        <div className={styles.container}>
            <div className={styles.cards}>
                <div className={styles.career_card}>
                    <img src="/images/join_us_career.png" alt="asd" />
                    <div className={styles.text_area}>
                        <h4>Join Us</h4>
                        <p>Become Part Of The Most Hardworking Team.</p>
                        <Link href={"/"}>Apply Now</Link>
                    </div>
                </div>

                <div className={styles.career_card}>
                    <img src="/images/influential_partnership.png" alt="asd" />
                    <div className={styles.text_area}>
                        <h4>Influnencer Partnership</h4>
                        <p>Become Part Of The Most Hardworking Team.</p>
                        <Link href={"/"}>Apply Now</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default career;