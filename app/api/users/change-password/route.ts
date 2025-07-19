import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const { userId, oldPassword, newPassword } = await request.json()

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect old password" }, { status: 401 })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    await prisma.users.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    })

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
