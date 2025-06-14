import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { full_name, email, phone } = body

  if (!full_name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { email: session.user.email },
      data: {
        full_name,
        email,
        phone,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
