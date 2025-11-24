import InfinteScroller from "@/components/InfinteScroller";
import Image from "next/image";
import styles from "@/styles/productPage.module.css";

export default function ChooseUsScroller({ chooseUs }) {
    if (!chooseUs?.length) return null;

    return (
        <section className={styles.icons}>
            <InfinteScroller>
                {chooseUs.map((item, idx) => (
                    <div className={styles.icon} key={idx}>
                        <Image src={item.imageUrl} width={80} height={80} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </InfinteScroller>
        </section>
    );
}
