import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
    })

    const mappedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(),
      created_at: user.created_at.toISOString(),
    }))

    return NextResponse.json(mappedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
