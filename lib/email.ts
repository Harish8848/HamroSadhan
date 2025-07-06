

import nodemailer from "nodemailer";

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Missing SMTP credentials. Check .env file.");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"HamroSadhan" <no-reply@hamrosadhan.com>',
    to,
    subject,
    html,
    replyTo: process.env.SMTP_REPLY || "support@hamrosadhan.com",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error);
    throw error;
  }
}