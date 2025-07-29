import React from 'react';
import styles from '@/styles/faqs.module.css'
const faqs = [
    {
        question: "What are the benefits of using hair oil?",
        answer: "Hair oil helps nourish the scalp, strengthens hair roots, reduces dandruff, and adds shine to your hair."
    },
    {
        question: "How often should I apply hair oil?",
        answer: "It is recommended to apply hair oil 2-3 times a week for best results."
    },
    {
        question: "Can hair oil help with hair growth?",
        answer: "Yes, regular use of hair oil can stimulate hair follicles and promote healthy hair growth."
    },
    {
        question: "Should I apply hair oil to wet or dry hair?",
        answer: "You can apply hair oil to both wet and dry hair, but applying to slightly damp hair helps with better absorption."
    },
    {
        question: "How long should I leave hair oil in my hair?",
        answer: "Leave the oil in your hair for at least 1-2 hours, or overnight for deep conditioning before washing it out."
    }
];

function FaqItem({ question, answer }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div div className={styles.faqItem}>
            <section
                className={styles.question}
                onClick={() => setOpen((prev) => !prev)}
            >
                Q: {question}
            </section>

            {open && (
                <section className={styles.answer}>
                    <p>A: {answer}</p>
                </section>
            )}
        </div>
    );
}

const Faqs = () => (
    <div className={styles.container}>
        <h1 className={styles.heading}>Hair Oil FAQs</h1>
        <div className={styles.faqItems}>
            {faqs.map((faq, idx) => (
                FaqItem(faq)
            ))}
        </div>
    </div>
);

export default Faqs;