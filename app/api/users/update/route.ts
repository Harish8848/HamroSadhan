import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(request: Request) {
  try {
    const { userId, fullName, phone } = await request.json()

    if (!userId || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updateData: any = {
      full_name: fullName,
      updated_at: new Date(),
    }

    if (phone !== undefined && phone !== null) {
      updateData.phone = phone
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
