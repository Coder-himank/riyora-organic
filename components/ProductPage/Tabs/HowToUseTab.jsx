import styles from "@/styles/productPage.module.css";

export default function HowToUseTab({ product }) {
    return (
        <section className={styles.howtouse_tab}>
            <h3>
                How <span>to Apply</span>
            </h3>

            <div className={styles.apply_section}>
                {product?.howToApply?.map((step, idx) => (
                    <div key={idx} className={styles.apply_box}>
                        <h4>{step.step}</h4>
                        <p>{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
