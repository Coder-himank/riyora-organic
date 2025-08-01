import connectDB from "@/server/db";
import Feedback from "@/server/models/Feedback";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, name, email, message } = req.body;

    if (!userId || !name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await connectDB();

        const feedback = new Feedback({
            userId,
            name,
            email,
            message,
        });

        await feedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}