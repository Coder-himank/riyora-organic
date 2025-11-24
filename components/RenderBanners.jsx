import Image from "next/image";
import styles from "@/styles/productPage.module.css";

export default function RenderBanners({ banners, position }) {
    if (!banners) return null;

    return (
        <>
            {banners
                .filter(b => b.position === position)
                .map((b, idx) => (
                    <section className={styles.banner} key={idx}>
                        <Image
                            src={b.imageUrl || "/images/banner1.png"}
                            width={1080}
                            height={500}
                            alt={b.alt || "Banner"}
                        />
                    </section>
                ))}
        </>
    );
}
