import { useEffect, useState } from "react";
import styles from "@/styles/offer.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

export default function OfferPage() {
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const router = useRouter();

  function calculateTime(targetDate) {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return null;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${d}d : ${h}h : ${m}m : ${s}s`;
  }

  // Fetch promo when code loads
  useEffect(() => {
    if (!router.query.offerCode) return;

    async function fetchPromo() {
      try {
        setLoading(true);
        const res = await axios.get("/api/getPromo?code=" + router.query.offerCode);
        const data = res.data;

        if (!data) {
          setPromo(false);
        } else {
          setPromo(data);
          setTimeLeft(calculateTime(data.expiry));
        }
      } catch (err) {
        console.error("Promo fetch error:", err);
        setPromo(false);
      } finally {
        setLoading(false);
      }
    }

    fetchPromo();
  }, [router.query.offerCode]);

  // Start live countdown when promo is loaded
  useEffect(() => {
    if (!promo || !promo.expiry) return;

    const timer = setInterval(() => {
      const t = calculateTime(promo.expiry);
      setTimeLeft(t ?? "EXPIRED");
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  if (loading) {
    return <div className={styles.center}>Loading exciting offer...</div>;
  }

  if (promo === false) {
    return <div className={styles.center}>No Offer Found</div>;
  }

  const isLimitReached = promo?.usageLimit ? promo.timesUsed >= promo.usageLimit : false;

  const goToCheckout = async () => {
    if (!promo) return;

    try {
      if (promo.applicableProducts?.length === 1) {
        const prodRes = await axios.get("/api/getProducts?id=" + promo.applicableProducts[0]);
        const prodData = prodRes.data;

        if (prodData[0]?.slug) {
          router.push(`/products/${prodData[0].slug}`);
          return;
        }
      }
      router.push("/products");
    } catch (err) {
      console.error("Checkout redirect error:", err);
      router.push("/products");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={styles.badge}>Limited Offer</span>

        <h1 className={styles.title}>
          Get <b>{promo.discount}% OFF</b>{" "}
          {promo.usageLimit ? <span>for First {promo.usageLimit} Users!</span> : ""}
        </h1>

        <p className={styles.desc}>{promo.description}</p>

        <div className={styles.codeBox}>{promo.code}</div>

        {/* TIMER DISPLAY (corrected) */}
        <p className={`${styles.timer} ${timeLeft === "EXPIRED" || isLimitReached ? styles.timeOver : ""}`}>
          {timeLeft && timeLeft !== "EXPIRED"
            ? new Date(promo.validFrom) > new Date()
              ? `⏳ Starts In: ${timeLeft}`
              : `⚡ Valid For: ${timeLeft}`
            : "Offer Ended"}
        </p>

        {timeLeft && timeLeft !== "EXPIRED" && !isLimitReached ? (
          <>
            <p className={styles.usersLeft}>
              {isLimitReached
                ? "❗ Offer Limit Reached"
                : promo.usageLimit
                ? `🔥 Only ${promo.usageLimit - promo.timesUsed} spots left!`
                : ""}
            </p>

            <button
              onClick={goToCheckout}
              disabled={isLimitReached}
              className={styles.btn}
            >
              {isLimitReached ? "Offer Closed" : "Claim Discount & Checkout"}
            </button>
          </>
        ) : (
          <Link href="/products">Buy Products And Check Other Offers!!</Link>
        )}
      </div>
    </div>
  );
}
