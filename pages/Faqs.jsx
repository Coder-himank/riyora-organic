import React from 'react';

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

const Faqs = () => (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
        <h1>Hair Oil FAQs</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {faqs.map((faq, idx) => (
                <li key={idx} style={{ marginBottom: 24 }}>
                    <strong>Q: {faq.question}</strong>
                    <p style={{ margin: '8px 0 0 0' }}>A: {faq.answer}</p>
                </li>
            ))}
        </ul>
    </div>
);

export default Faqs;