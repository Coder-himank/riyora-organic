import ExpandableSection from "@/components/ExpandableSection";
import Image from "next/image";
import styles from "@/styles/productPage.module.css";

export default function SuitableSection({ product }) {
  const list = product.suitableFor || [];

  return (
    <ExpandableSection title="Suitable For">
      <div className={styles.suitable_cards}>
        {list.map((s, i) => (
          <div key={i} className={styles.suitable_images}>
            <Image src={s.imageUrl} width={300} height={300} alt={s.name} />
            <p>{s.name}</p>
          </div>
        ))}
      </div>
    </ExpandableSection>
  );
}
