import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
    }

    const normalizedRole = role.trim().toLowerCase();
    console.log("Updating user role to:", normalizedRole);

    // Accept only valid roles
    const validRoles = ["admin", "user", "pending"];
    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { role: normalizedRole, updated_at: new Date() },
    })

    return NextResponse.json({
      id: updatedUser.id.toString(),
      role: updatedUser.role,
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
