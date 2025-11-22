// components/PromoSection.jsx
import React from "react";
import styles from "@/styles/PromoSection.module.css"; // ← You can keep or change path

export default function PromoSection({
  promocode,
  setPromocode,
  promoError,
  promoMessage,
  availablePromos,
  ValidateAndApplyPromo,
}) {
  return (
    <section className={styles.promo_section}>

      {/* Header Input + Button */}
      <section className={styles.promo_section_head}>
        <input
          type="text"
          placeholder="Promo code"
          value={promocode}
          onChange={(e) => setPromocode(e.target.value)}
          className={styles.inputPromo}
        />
        <button className={styles.applyBtn} onClick={ValidateAndApplyPromo}>
          Apply
        </button>
      </section>

      {/* Error / Success Message */}
      <section>
        {promoError && (
          <p className={styles.promoError}>{promoError}</p>
        )}
        {promoMessage && !promoError && (
          <p className={styles.promoMessage}>{promoMessage}</p>
        )}
      </section>

      {/* List of Available Promos */}
      <section className={styles.promoList}>
        {availablePromos.length > 0 ? (
          availablePromos.map((promo) => (
            <div
              key={promo._id}
              className={`${styles.promoItem} ${promocode.toUpperCase() === promo.code.toUpperCase()
                ? styles.promoactive
                : ""
                }`}
              onClick={() => { setPromocode(promo.code); ValidateAndApplyPromo() }}
            >
              <section>
                Use <strong>{promo.code}</strong> For extra {promo.discount}% off!
              </section>
              <p>{promo.description}</p>
            </div>
          ))
        ) : (
          <div className={styles.noPromo}>No active promo codes available.</div>
        )}
      </section>

    </section>
  );
}
