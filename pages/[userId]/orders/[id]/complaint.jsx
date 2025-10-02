import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "@/styles/ComplaintPage.module.css";
import { MultiImageUploader } from "@/components/ImageUploader";
import toast from "react-hot-toast";
import axios from "axios";

export default function ComplaintPage() {
    const router = useRouter();
    const { id: orderId, productId } = router.query;
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [complaintText, setComplaintText] = useState("");
    const [images, setImages] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    // Add image to state
    const handleAddImage = (img) => {
        setImages((prev) => [...prev, ...img]);
    };

    // Remove image from state
    const handleRemoveImage = (img) => {
        setImages((prev) => prev.filter((i) => i !== img[0]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason || !complaintText) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                orderId,
                userId: session?.user?.id,
                reason,
                complaintText,
                productId,
                images, // if your uploader saves paths/urls, send them as array
            };

            const res = await axios.post("/api/complaints", JSON.parse(JSON.stringify(payload)));

            toast.success("Complaint submitted successfully!");

            setTimeout(() => {
                router.push(`/${session?.user?.id}/orders/${orderId}`);
            }, 5000);

            setSubmitted(true)

        } catch (err) {
            console.error(err);
            toast.error("Error submitting complaint.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {

        return (
            <div className={styles.container}>
                <h1 className={styles.heading}>Complaint Submitted</h1>
                <p className={styles.thankYouText}>Thank you for your feedback. We will review your complaint and get back to you shortly.</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>File a Complaint</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Complaint Reason */}
                <label className={styles.label}>Select Reason</label>
                <select
                    className={styles.select}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="">-- Select a Reason --</option>
                    <option value="Damaged Product">Damaged Product</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Poor Quality">Poor Quality</option>
                    <option value="Other">Other</option>
                </select>

                {/* Complaint Text */}
                <label className={styles.label}>Complaint Details</label>
                <textarea
                    className={styles.textarea}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Describe your issue..."
                />

                {/* Image Upload */}
                <label className={styles.label}>Upload Images (Optional)</label>
                <MultiImageUploader
                    images={images}
                    setDataFunction={handleAddImage}
                    removeDataFunction={handleRemoveImage}
                    fileFolder={`${orderId}-complaints`}
                />

                {/* Submit Button */}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Complaint"}
                </button>
            </form>
        </div>
    );
}
