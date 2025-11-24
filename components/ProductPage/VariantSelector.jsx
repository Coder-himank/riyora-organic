import styles from "@/styles/productPage.module.css";

export default function VariantSelector({ product, selectedVariant, router, setSelected }) {
    return (
        <div className={styles.variants}>
            {[product, ...(product.variants || [])].map(variant => {
                const active = selectedVariant?._id === variant._id;
                return (
                    <div
                        key={variant._id}
                        className={`${styles.variant_card} ${active ? styles.selected_variant : ""}`}
                        onClick={() => {
                            setSelected(variant);
                            router.push(
                                { pathname: router.pathname, query: { ...router.query, variantId: variant._id } },
                                undefined,
                                { shallow: true }
                            );
                        }}
                    >
                        <span>{variant.quantity}</span>
                    </div>
                );
            })}
        </div>
    );
}
