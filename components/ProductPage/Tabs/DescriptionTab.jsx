import styles from "@/styles/productPage.module.css";

export default function DescriptionTab({ pInfodata }) {
    return (
        <div className={styles.description_tab}>
            <h3>Description</h3>
            <p>{pInfodata?.description}</p>
        </div>
    );
}
