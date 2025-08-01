import React, { useState } from "react";
import styles from '@/styles/contact.module.css'
import axios from "axios";
import { useSession } from "next-auth/react";
const Contact = () => {
    const { data: session } = useSession();
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        try {
            await axios.post(`/api/secure/submitFeedback`, {
                userId: session?.user?.id, ...form
            })
            setSubmitted(true);
        } catch (e) {
            alert("Error Submit The Form. Try Agin!")
        }
    };

    return (
        <>
            <section className={styles.header_section}>
                <h1>Contact Us</h1>
                <p>
                    We value your feedback and are here to help with any questions or concerns you may have. If you would like to share your experience or report an issue, please fill out the form below. The Ryora Organic team appreciates your input and will get back to you as soon as possible.
                </p>
            </section>
            <div className={styles.form}>
                {submitted ? (
                    <center><div style={{ color: "green", marginTop: 20 }}>Thank you for contacting us!</div></center>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Message</label>
                            <textarea
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