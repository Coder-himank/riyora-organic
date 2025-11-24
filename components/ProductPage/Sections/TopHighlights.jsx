import ExpandableSection from "@/components/ExpandableSection";
import styles from "@/styles/productPage.module.css";

export default function TopHighlights({ product }) {
    const details = product.details || {};

    return (
        <ExpandableSection title="Top Highlights">
            <div className={styles.highlights}>
                <p>
                    <strong>Key Ingredients - </strong>
                    {details.keyIngredients?.join(", ")}
                </p>

                <p>
                    <strong>Ingredients - </strong>
                    {details.ingredients?.join(", ")}
                </p>

                <p>
                    <strong>Hair Type - </strong>
                    {details.hairType}
                </p>

                <p>
                    <strong>Product Benefits - </strong>
                    {details.benefits?.join(", ")}
                </p>

                <p>
                    <strong>Item Form - </strong>
                    {details.itemForm}
                </p>
            </div>
        </ExpandableSection>
    );
}
