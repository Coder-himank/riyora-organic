import ExpandableSection from "@/components/ExpandableSection";
import { camelToNormal } from "@/utils/utils";
import styles from "@/styles/productPage.module.css";

export default function SpecSection({ product }) {
    return (
        <ExpandableSection title="Specifications" defaultOpen={false}>
            <table className={styles.specifications}>
                <tbody>
                    {Object.entries(product.specifications || {}).map(([k, v]) => (
                        <tr key={k}>
                            <td className={styles.strong}>{camelToNormal(k)}</td>
                            <td>{v || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ExpandableSection>
    );
}
