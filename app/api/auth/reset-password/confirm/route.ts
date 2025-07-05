import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Reset password confirm request body:", body)
    const { token, password } = body

    if (!token || typeof token !== "string") {
      console.error("Invalid or missing token:", token)
      return NextResponse.json({ error: "Invalid or missing token" }, { status: 400 })
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      console.error("Invalid password:", password)
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    // Verify JWT token
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      console.error("JWT verification error:", err)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const userId = payload.userId
    if (!userId) {
      console.error("Invalid token payload, missing userId:", payload)
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: hashedPassword,
      },
    })

    return NextResponse.json({ error: null })
  } catch (error: any) {
    console.error("Reset password confirm error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
