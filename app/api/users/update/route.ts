import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(request: Request) {
  try {
    const { userId, fullName, phone } = await request.json()

    if (!userId || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        full_name: fullName,
        phone: phone || null,
        updated_at: new Date(),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
