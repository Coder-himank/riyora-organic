// pages/api/subscribe.js
import connectDB from "@/server/db";
import SubscribeUser from "@/server/models/SubscribeUser";
import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Utility function to send an email using Resend.
 */
async function sendMail(to, subject, html) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

/**
 * API Route: Subscribe a user to the newsletter.
 *
 * - Accepts POST requests with an email address
 * - Saves the email to the database (if not already subscribed)
 * - Sends a welcome email to the subscriber
 */
export default async function handler(req, res) {
  await connectDB();

  const mailSubject = "Thank You For Subscribing - Riyora Organic";
  const mailHtml = `
    <h1>Thank You</h1>
    <p>You will be notified about our latest news and updates.</p>
  `;

  if (req.method === "POST") {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user already exists in the database
      const existingUser = await SubscribeUser.findOne({ email });

      if(existingUser) {
        // Send confirmation email even if already subscribed
        await sendMail(email, mailSubject, mailHtml);
        return res.status(200).json({ message: "Already subscribed" });
      }

      // Send confirmation email regardless of subscription status
      await sendMail(email, mailSubject, mailHtml);

      // Save only if user does not exist
      if (!existingUser) {
        const newUser = new SubscribeUser({ email });
        await newUser.save();
      }

      return res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
      console.error("Subscription error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}