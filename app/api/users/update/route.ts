import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(request: NextRequest) {
  try {
    const { userId, full_name, phone } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const updateData: { full_name?: string; phone?: string } = {}
    if (full_name !== undefined) {
      updateData.full_name = full_name
    }
    if (phone !== undefined) {
      updateData.phone = phone
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No data to update" }, { status: 200 })
    }

    await prisma.users.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}