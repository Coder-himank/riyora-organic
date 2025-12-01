import { useEffect, useState } from "react";
import styles from "@/styles/offer.module.css";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
export default function OfferPage() {
    const [promo, setPromo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(""); // 👈 timer state

    const router = useRouter()

    // 👇 Timer Logic Function
    function calculateTime(targetDate) {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0) return null;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return `${d}d : ${h}h : ${m}m : ${s}s`;
    }

    useEffect(() => {
        if (!router.query.offerCode) return; // wait for code

        async function fetchPromo() {
            try {
                setLoading(true);

                const res = await axios.get("/api/getPromo?code=" + router.query.offerCode);
                const data = res.data;

                setPromo(data ?? false); // 👈 important change
            } catch (err) {
                setPromo(false); // 👈 explicitly mark not found
            } finally {
                setLoading(false);
            }
        }

        fetchPromo();
    }, [router.query.offerCode]);

    if (loading) {
        return <div className={styles.center}>Loading exciting offer...</div>;
    }

    if (promo === false) {  // 👈 check this instead of !promo
        return <div className={styles.center}>No Offer Found</div>;
    }


    const isLimitReached = promo.usageLimit ? promo.timesUsed >= promo.usageLimit : false;

    const goToCheckout = async () => {
        if (!promo) return
        if (promo.applicableProducts?.length === 1) {
            const prodRes = await fetch("/api/getProducts?id=" + promo.applicableProducts[0]);
            const prodData = await prodRes.json();
            if (prodData[0].slug) {
                Router.push(`/products/${prodData[0].slug}`);
                return;
            }
        }
        Router.push("/products");
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

                {/* 👇 SHOW TIMER HERE */}
                <p className={`${styles.timer} ${timeLeft ? "" : styles.timeOver}`}>
                    {timeLeft ? new Date(promo.validFrom) > new Date()
                        ? `⏳ Starts In: ${timeLeft}`
                        : `⚡ Valid For: ${timeLeft}` : "Validity Ended"}
                </p>

                {timeLeft && !isLimitReached ? (
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
                ) : <Link href={"/products"}>Buy Products And Check Other Offers!!</Link>}
            </div>




        </div>
    );
}
