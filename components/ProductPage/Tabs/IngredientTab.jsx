import Image from "next/image";
import Carousel from "@/components/Carousel";
import styles from "@/styles/productPage.module.css";

export default function IngredientsTab({ pInfodata }) {
  return (
    <div className={styles.ingredients_tab}>
      <h3>Ingredients</h3>

      <Carousel showControls={false}>
        {pInfodata?.ingredients?.map((ingredient, idx) => (
          <div key={idx} className={styles.ingredient_card}>
            <Image src={ingredient.imageUrl} width={150} height={150} alt={ingredient.name} />

            <div className={styles.text_wrapper}>
              <h4>{ingredient.name}</h4>
              <p>{ingredient.description}</p>

              <ul>
                {ingredient.notes?.map((note, nidx) => (
                  <li key={nidx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
