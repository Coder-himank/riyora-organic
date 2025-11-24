import styles from "@/styles/productPage.module.css";

export default function BenefitsTab({ pInfodata }) {
  return (
    <div className={styles.benefits_tab}>
      <h3>Benefits Products</h3>

      <ul>
        {pInfodata?.benefits?.list?.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
