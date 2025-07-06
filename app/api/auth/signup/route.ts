import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { sendEmail } from "@/lib/email"
import jwt from "jsonwebtoken"

const EMAIL_CONFIRMATION_SECRET = process.env.EMAIL_CONFIRMATION_SECRET || "email_secret"
const SMTP_HOST = process.env.SMTP_HOST || "smtp.ethereal.email"
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER || ""
const SMTP_PASS = process.env.SMTP_PASS || ""

if (!EMAIL_CONFIRMATION_SECRET || !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error("Missing required environment variables for email configuration");
  throw new Error("Missing required environment variables for email configuration");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      console.error("Missing required fields:", { email, password, fullName });
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new NextResponse(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Adjusted password regex to allow special characters as well
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/; // Minimum 8 characters, at least one letter and one number, special chars allowed
    if (!passwordRegex.test(password)) {
      console.error("Weak password:", password);
      return new NextResponse(
        JSON.stringify({
          error: "Password must be at least 8 characters long and include at least one letter and one number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      if (existingUser.role === "pending") {
        // Resend confirmation email
        const token = jwt.sign({ userId: existingUser.id }, EMAIL_CONFIRMATION_SECRET, { expiresIn: "1d" })
        const confirmationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/confirm-email?token=${token}`
        try {
          const subject = "Verify your email to sign in to HamroSadhan";
          const html = `<p>Hi ${existingUser.full_name},</p>
                        <p>Your email is pending confirmation. Please verify your email by clicking the link below:</p>
                        <a href="${confirmationUrl}">${confirmationUrl}</a>`;
          await sendEmail(email, subject, html);
        } catch (emailError) {
          console.error("Error resending confirmation email:", emailError);
          return new NextResponse(
            JSON.stringify({
              message: "Signup successful, but failed to resend confirmation email. Please contact support.",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        return new NextResponse(
          JSON.stringify({
            message: "Email already registered but pending confirmation. Confirmation email resent.",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        console.error("Email already registered:", email);
        return new NextResponse(JSON.stringify({ error: "Email already registered" }), { status: 409, headers: { "Content-Type": "application/json" } })
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    let newUser;
    try {
      newUser = await prisma.users.create({
        data: {
          email,
          full_name: fullName,
          phone: phone || "",
          password_hash: passwordHash,
          role: "pending",
        },
      });
    } catch (dbError) {
      console.error("Database error during user creation:", dbError);
      return new NextResponse(JSON.stringify({ error: "Failed to create user. Please try again later." }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // Generate email confirmation token
    const token = jwt.sign({ userId: newUser.id }, EMAIL_CONFIRMATION_SECRET, { expiresIn: "1d" })

    const confirmationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/confirm-email?token=${token}`

    // Send confirmation email
    try {
      const subject = "Verify your email to sign in to HamroSadhan";
      const html = `<p>Hi ${fullName},</p>
                    <p>Please verify your email by clicking the link below to sign in to HamroSadhan:</p>
                    <a href="${confirmationUrl}">${confirmationUrl}</a>`;
      await sendEmail(email, subject, html);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      return new NextResponse(
        JSON.stringify({
          message: "Signup successful, but failed to send confirmation email. Please contact support.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify({ message: "Signup successful, please check your email to confirm your account." }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse(JSON.stringify({ error: "Email already registered" }), { status: 409, headers: { "Content-Type": "application/json" } })
    }
    return new NextResponse(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
