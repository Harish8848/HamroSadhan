import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { sendEmail } from "@/lib/email"
import jwt from "jsonwebtoken"

const EMAIL_CONFIRMATION_SECRET = process.env.EMAIL_CONFIRMATION_SECRET || "email_secret"
const SMTP_HOST = process.env.SMTP_HOST || "smtp.ethereal.email"
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER || ""
const SMTP_PASS = process.env.SMTP_PASS || ""

if (!EMAIL_CONFIRMATION_SECRET || !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error("Missing required environment variables for email configuration")
  throw new Error("Missing required environment variables for email configuration")
}

const transporter = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
}

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error: "Password must be at least 8 characters long and include at least one letter and one number.",
      }, { status: 400 })
    }

    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      if (existingUser.role === "pending") {
        const token = jwt.sign({ userId: existingUser.id }, EMAIL_CONFIRMATION_SECRET, { expiresIn: "1d" })
        const confirmationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/confirm-email?token=${token}`
        try {
          const subject = "Verify your email to sign in to HamroSadhan"
          const html = `<p>Hi ${existingUser.full_name},</p>
                        <p>Your email is pending confirmation. Please verify your email by clicking the link below:</p>
                        <a href="${confirmationUrl}">${confirmationUrl}</a>`
          await sendEmail(email, subject, html)
        } catch (emailError) {
          return NextResponse.json({
            message: "Signup successful, but failed to resend confirmation email. Please contact support.",
          }, { status: 200 })
        }
        return NextResponse.json({
          message: "Email already registered but pending confirmation. Confirmation email resent.",
        }, { status: 200 })
      } else {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 })
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await prisma.users.create({
      data: {
        email,
        full_name: fullName,
        phone: phone || "",
        password_hash: passwordHash,
        role: "pending",
      },
    })

    const token = jwt.sign({ userId: newUser.id }, EMAIL_CONFIRMATION_SECRET, { expiresIn: "1d" })

    const confirmationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/confirm-email?token=${token}`

    try {
      const subject = "Verify your email to sign in to HamroSadhan"
      const html = `<p>Hi ${fullName},</p>
                    <p>Please verify your email by clicking the link below to sign in to HamroSadhan:</p>
                    <a href="${confirmationUrl}">${confirmationUrl}</a>`
      await sendEmail(email, subject, html)
    } catch (emailError) {
      return NextResponse.json({
        message: "Signup successful, but failed to send confirmation email. Please contact support.",
      }, { status: 200 })
    }

    return NextResponse.json({
      message: "Signup successful, please check your email to confirm your account.",
    }, { status: 200 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
