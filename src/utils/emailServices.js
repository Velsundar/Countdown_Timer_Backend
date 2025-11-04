import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
/**
 * Create email transporter
 */
console.log("EMAIL HOST",process.env.EMAIL_PORT)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email using Nodemailer
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
};