import styles from "@/styles/career.module.css"
import Link from "next/link";
import Image from "next/image";
export const career = () => {
    return (
        <div className={styles.container}>
            <div className={styles.cards}>
                <div className={styles.career_card}>
                    <Image src="/images/join_us_career.png" alt="asd" width={300}
                        height={300} />
                    <div className={styles.text_area}>
                        <h4>Join Us</h4>
                        <p>Become Part Of The Most Hardworking Team.</p>
                        <Link href={"/"}>Apply Now</Link>
                    </div>
                </div>

                <div className={styles.career_card}>
                    <Image src="/images/influential_partnership.png" alt="asd" width={300} height={300} />
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