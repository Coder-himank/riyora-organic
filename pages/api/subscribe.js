import connectDB from '@/server/db';
import SubscribeUser from '@/server/models/SubscribeUser';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(to, subject, html) {

    const data = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
    });
}

export default async function handler(req, res) {
    await connectDB();

    const mailSubject = "Thank You For Subscribing Riyora Organic."
    const mailBody = "You Will get The Updates OF Riyora Organic"
    const mailHtml = "<h1>Thank You</h1><p>Your Will Get Notify About OUr Latest News and Updates...</p>"

    if (req.method === 'POST') {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // Check if user already subscribed
            const existing = await SubscribeUser.findOne({ email });
            // if (existing) {
            //     return res.status(409).json({ error: 'User already subscribed' });
            // }

            try {
                sendMail(email, mailSubject, mailHtml)
            } catch (e) {
                console.log("Unable to send mail : ", e)
            }

            if (!existing) {
                const user = new SubscribeUser({ email });
                await user.save();
            }

            res.status(201).json({ message: 'Subscribed successfully' });
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}