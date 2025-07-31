import styles from '@/styles/about.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <section className={`${styles.aboutRiyora} ${styles.block_wrapper}`}>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
        <div className={styles.text_content}>
          <h1>About <span>Riyora Organics</span></h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste optio qui maxime officiis. Voluptate itaque temporibus illum maiores alias numquam dignissimos fuga, facere dolorem reprehenderit at rem ad eos illo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem aspernatur labore, laborum cupiditate aut dolorum autem fugit neque repellat mollitia error fugiat aperiam, aliquid nemo? Quidem porro quasi praesentium quod voluptate dolore deleniti fugiat dolores ipsa labore ratione, cupiditate distinctio et deserunt delectus architecto quas provident? Corrupti facilis cupiditate laborum temporibus deleniti vel sequi recusandae distinctio voluptatum repellat. Non tempora quibusdam nam blanditiis amet aliquid libero, quas nihil animi omnis dolorem autem aut enim fugit dicta. Cupiditate expedita provident sunt quis, optio maiores quam laborum sint praesentium ad sed voluptatem dignissimos saepe minima eligendi a unde eum odit veniam non.</p>
        </div>
      </section>
      <section className={`${styles.ourPhilosophy} ${styles.block_wrapper}`}>
        <div className={styles.text_content}>
          <h3>Our Philosophy</h3>
          <p>
            At Riyora Organics, we believe that true beauty starts with balance—between nature and nurture,
            tradition and science, care and consistency. In an age of synthetic shortcuts and chemical overload,
            we’re returning to the roots of health wellness with clean, powerful formulations inspired by Ayurveda
            and modern botanical research. Every bottle we create carries the essence of tradition, the rigour of
            science, and the purity of nature.
          </p>
        </div>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
      </section>

      <section className={`${styles.block_wrapper} ${styles.ourVision}`}>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
        <div className={styles.text_content}>
          <h3>Our Vision</h3>
          <p>
            To empower individuals to embrace natural, effective, and honest self-care through time-tested Ayurvedic
            wisdom and modern science. Riyora Organic envisions a world where clean, herbal care becomes a daily ritual —
            free from toxic chemicals, gimmicks, and false promises. We aim to restore trust in ancient plant-powered
            solutions while ensuring modern quality, elegance, and consistency.
          </p>
        </div>
      </section>

      <section className={`${styles.block_wrapper} ${styles.howItStarted}`}>
        <div className={styles.text_content}>
          <h3>How It All Started</h3>
          <p>
            Riyora's journey began not as a brand, but as a need — a need to replace harmful, chemical-laced products
            with something pure, honest, and truly effective.
          </p>
          <p>
            While working in an industrial area, I experienced constant hair fall, dandruff, and extreme dryness. My hair
            became stiff and lifeless, and my scalp felt itchy and sensitive. Around the same time, my mother also struggled
            with hair issues. Despite using many well-known products, there was no real improvement. Eventually, we consulted
            a doctor, and some improvement began to show in her hair growth.
          </p>
          <p>
            But then something unexpected happened. She applied the same Henna (Mehendi) she had trusted and used for over
            25 years — and suddenly experienced a severe allergic reaction. Her scalp broke out in painful rashes, her eyes
            turned red, and tiny blisters appeared. Monthly medical expenses kept rising, but the problem didn’t go away.
            The question kept haunting us: How can a product she trusted for decades suddenly cause harm?
          </p>
          <p>
            That’s when we realized the bitter truth: adulteration.
          </p>
          <p>
            Determined to find a safe alternative, my mother began collecting herbs at home and preparing her own homemade
            hair oil using traditional methods. She used it consistently for a few months — and gradually, her hair fall
            reduced, and her scalp felt calmer.
          </p>
          <p>
            One day, she gave that same oil to me. I used it with no expectations. But within a few months, even I noticed
            the change — my hair started feeling softer, smoother, and healthier than it had in years. After seeing the
            visible improvement in my hair, even our relatives started asking for the oil.
          </p>
          <p>
            One day, while my mom and I were making a fresh batch, my father jokingly said, “You should start a business
            with this.” This personal transformation became our inspiration.
          </p>
        </div>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
      </section>

      <section className={`${styles.block_wrapper} ${styles.evolution}`}>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
        <div className={styles.text_content}>
          <h3>The Evolution of Riyora</h3>
          <p>
            We started researching more about herbal remedies and Ayurvedic practices. We consulted Ayurvedic doctors and
            refined the formula step-by-step. Over the next two years, we gave samples to friends and women in our community —
            and they too experienced visible improvements. Encouraged by their feedback, we worked with a professional
            formulator to standardize the process and ensure purity and safety.
          </p>
          <p>
            At first, we didn’t even think of selling — we were just giving it to help others. But when people started coming
            back and asking to buy it, we realized: this works. Though we never made medical claims, these genuine results gave
            us confidence. We knew we were onto something that truly worked — safely, naturally, and honestly.
          </p>
          <p>
            For two years, we sold the oil without any branding — purely through word of mouth. And when the demand kept growing,
            we realized this was more than just a homemade remedy.
          </p>
        </div>
      </section>

      <section className={`${styles.block_wrapper} ${styles.ourMission}`}>
        <div className={styles.text_content}>
          <h3>Our Mission</h3>
          <p>
            That was the moment Riyora Organic was born. Riyora Organic is not just to sell a product, but to share a mission
            against toxic chemicals and harmful products.
          </p>
        </div>
        <div className={styles.image_wrapper}>
          <img src="/images/ayurveda-utensils.jpg" alt="About Us" />
        </div>
      </section>
    </div>
  );
}
