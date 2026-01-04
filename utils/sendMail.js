import nodemailer from "nodemailer";
import { Resend } from "resend";
import "dotenv/config";

/**
 * Send email using predefined templates
 * @param {string} email - receiver email
 * @param {string} type - template key (otpAuth, orderSuccess, passwordReset)
 * @param  {...any} args - arguments required by the template
 */

const SENDER = `"Riyora Organic" <${process.env.GMAIL_USER}>`;



const mailTemplates = {
  /* =========================
     ORDER PLACED SUCCESSFULLY
     ========================= */
  orderPlaced: {
    from: `"Riyora Organic" <${process.env.EMAIL_USER}>`,
    subject: "Order Placed Successfully 🎉",
    html: (orderId, customerName) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Hi ${customerName},</h2>
        <p>Your order has been <strong>placed successfully</strong>!</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p>We are preparing your items and will notify you once they are shipped.</p>
        <p>Thank you for shopping with us ❤️</p>
      </div>
    `,
  },

  /* =========================
     ORDER FAILED
     ========================= */
  orderFailed: {
    from: `"Riyora Organic" <${process.env.EMAIL_USER}>`,
    subject: "Order Failed ❌",
    html: (customerName, reason) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Hi ${customerName},</h2>
        <p>Unfortunately, your order could not be completed.</p>
        <p><strong>Reason:</strong> ${reason || "Unknown error"}</p>
        <p>Please try placing the order again or contact our support team.</p>
      </div>
    `,
  },

  /* =========================
     EXTERNAL SYSTEM FAILURE
     ========================= */
  externalSystemFailure: {
    from: `"Riyora Organic" <${process.env.EMAIL_USER}>`,
    subject: "Temporary Service Issue ⚠️",
    html: (customerName) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Hi ${customerName},</h2>
        <p>We’re experiencing a temporary issue with one of our systems.</p>
        <p>Your request could not be processed at the moment.</p>
        <p>Please try again later. We apologize for the inconvenience.</p>
      </div>
    `,
  },

  /* =========================
     ORDER DELIVERED
     ========================= */
  delivered: {
    from: `"Riyora Organic" <${process.env.EMAIL_USER}>`,
    subject: "Order Delivered 📦",
    html: (orderId, customerName) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Hi ${customerName},</h2>
        <p>Your order <strong>${orderId}</strong> has been <strong>delivered successfully</strong> 🎉</p>
        <p>We hope you enjoy your purchase.</p>
        <p>If you loved it, feel free to leave a review!</p>
      </div>
    `,
  },

  /* =========================
     PAYMENT FAILED
     ========================= */
  paymentFailed: {
    from: `"Riyora Organic" <${process.env.EMAIL_USER}>`,
    subject: "Payment Failed 💳",
    html: (orderId, customerName) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Hi ${customerName},</h2>
        <p>Your payment for order <strong>${orderId}</strong> was unsuccessful.</p>
        <p>Please try again using a different payment method.</p>
        <p>If the issue persists, contact your bank or our support team.</p>
      </div>
    `,
  },

  otpAuth: {
    from: `"Authentication" <${process.env.GMAIL_USER}>`,
    subject: "Your OTP for Authentication",
    html: (otp, validityMinutes = 5) => `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px;">
        <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #111827; margin-bottom: 10px;">
            OTP Verification
          </h2>

          <p style="color: #374151; font-size: 14px;">
            Use the following One-Time Password (OTP) to authenticate your account:
          </p>

          <div style="
            margin: 20px 0;
            padding: 14px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            background: #f3f4f6;
            border-radius: 6px;
            color: #111827;
          ">
            ${otp}
          </div>

          <p style="color: #374151; font-size: 14px;">
            This OTP is valid for <strong>${validityMinutes} minutes</strong>.
          </p>

          <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
            If you did not request this code, please ignore this email.
          </p>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            © ${new Date().getFullYear()} Your Store. All rights reserved.
          </p>
        </div>
      </div>
    `,
  },
};


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* Verify SMTP on startup */
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP Error:", err);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});
const sendMail = async (to, type, ...args) => {
  try {
    const template = mailTemplates[type];
    if (!template) {
      throw new Error(`Email template "${type}" not found`);
    }

    const mailOptions = {
      from: SENDER,
      to,
      subject: template.subject,
      html: template.html(...args),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Send mail failed:", error.message);
    throw error;
  }
};

export default sendMail;