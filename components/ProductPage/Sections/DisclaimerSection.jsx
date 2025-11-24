import ExpandableSection from "@/components/ExpandableSection";
import styles from "@/styles/productPage.module.css";

export default function DisclaimerSection({ product }) {
    const list = product.disclaimers || {};

    return (
        <ExpandableSection title="Disclaimer" defaultOpen={false}>
            <ol className={styles.disclaimer}>
                {Object.entries(list).map(([_, v]) => (
                    <li key={v}>{v}</li>
                ))}
            </ol>
        </ExpandableSection>
    );
}
