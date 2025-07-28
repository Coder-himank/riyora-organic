import styles from '@/styles/about.module.css';
export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.text_area}>

        <h className={styles.heading}>About Us</h>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad adipisci laudantium architecto explicabo nobis doloremque quos qui perferendis? Fuga, doloribus fugit labore eum nihil mollitia dolorum corporis alias, magnam error quas modi reprehenderit similique minima libero ad totam iusto quam veniam? Deleniti saepe laudantium enim dolores suscipit iusto, illum quo corporis facilis numquam, molestias consequatur atque sit quisquam modi nostrum. Ullam, eaque? Illum nesciunt omnis saepe delectus placeat incidunt iste a? A eaque porro possimus maiores ad recusandae asperiores nemo assumenda dignissimos repellat mollitia voluptate non fugiat sit animi laborum voluptatem, voluptatum ipsam enim similique quasi. Quibusdam blanditiis repudiandae distinctio.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus aspernatur inventore ut pariatur atque, ipsa veritatis fuga quo quia non beatae fugit iure modi eum voluptate quae itaque minima fugiat animi. Sed quisquam in dolorum nesciunt minima officiis sunt vel, earum ex minus itaque eos saepe corrupti totam soluta! Voluptates quasi voluptatum consequuntur. Ab sequi eveniet corporis, vel odit laudantium cum, harum molestiae accusantium dolor beatae ex possimus nesciunt amet repellat doloribus maxime cumque? Unde architecto cupiditate voluptatem iure facere accusamus aut voluptas repudiandae neque iusto. Repudiandae laudantium delectus cumque amet ut labore sunt quis magni magnam, laboriosam, odit iusto?</p>
      </div>
      <div className={styles.image_area}>
        <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
      </div>
    </div>
  );
}
