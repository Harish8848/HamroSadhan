
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

async function sendResetPasswordEmail(to: string, resetUrl: string) {
  const subject = "Reset your HamroSadhan password"
  const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `
  await sendEmail(to, subject, html)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      // For security, do not reveal if user does not exist
      return NextResponse.json({ error: null })
    }

    // Generate JWT token for password reset with 1 hour expiry
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    // Construct reset password URL (adjust domain as needed)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    // Send reset password email
    await sendResetPasswordEmail(user.email, resetUrl)

    return NextResponse.json({ error: null })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
