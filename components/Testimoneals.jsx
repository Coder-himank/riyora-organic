import styles from "@/styles/Testimoneals.module.css";
import InfinteScroller from "@/components/InfinteScroller";
import Image from "next/image";
export const Testimoneals = () => {

    return (
        <section className={styles.testimonialSection}>
            <h2>What Our Clients Say</h2>

            <div className={styles.testimonials}>
                <InfinteScroller>
                    {Array.from({ length: 28 }).map((i, index) => (

                        <div key={index} className={styles.testimonial}>
                            <Image src={"/images/testimoneal/" + `${index + 1}` + ".png"} alt={`Testimonial ${index + 1}`} width={300} height={300} />

                        </div>
                    ))}
                </InfinteScroller>
            </div>
        </section>
    );
}

export default Testimoneals;