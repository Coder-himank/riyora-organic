import React, { useState } from "react";
import styles from '@/styles/contact.module.css'
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
const Contact = () => {
    const { data: session } = useSession();
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    // SEO: Add meta tags and meaningful content
    const [submitted, setSubmitted] = useState(false);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!session.user) {
        //     alert("Please Login")
        // }
        // Here you would typically send the form data to your backend
        try {
            await axios.post(`/api/secure/submitFeedback`, {
                userId: session?.user?.id || null, ...form
            })
            setSubmitted(true);
        } catch (e) {
            alert("Error Submit The Form. Try Agin!")
        }
    };

    return (
        <>
            <Head>
                <title>Contact Riyora Organic | Best Natural Hair Oil Brand</title>
                <meta name="description" content="Contact Riyora Organic, the leading natural hair oil brand. Share your feedback, ask questions, or report issues. We're here to help you achieve healthy, beautiful hair." />
                <meta name="keywords" content="Riyora Organic, contact, hair oil, natural hair care, organic hair oil, feedback, support" />
                <meta property="og:title" content="Contact Riyora Organic | Best Natural Hair Oil Brand" />
                <meta property="og:description" content="Get in touch with Riyora Organic for all your natural hair oil needs. We value your feedback and are ready to assist you." />
                <meta property="og:url" content="https://riyora-organic.vercel.app/contact" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://riyora-organic.vercel.app/images/Riyora-hair-oil-og.jpg" />
            </Head>
            <section className={styles.header_section}>
                {!session?.user && <p>User not signed in</p>}
                <h1>Contact Riyora Organic</h1>
                <p>
                    Have questions about our <strong>natural hair oil</strong> or want to share your experience with Riyora Organic? Fill out the form below and our team will respond promptly. Your feedback helps us provide the best organic hair care solutions.
                </p>
            </section>
            <div className={styles.form}>
                {submitted ? (
                    <center>
                        <div style={{ color: "green", marginTop: 20 }}>
                            Thank you for contacting Riyora Organic! We appreciate your feedback and will get back to you soon.
                        </div>
                    </center>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <button type="submit" style={{ padding: "10px 24px" }}>
                            Send
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default Contact;