import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !token.sub) {
    console.log("No token or user found")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = token.sub
  const userRole = (token as any).role

  console.log("User ID:", userId)
  console.log("User Role:", userRole)

  try {
    const body = await request.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 })
    }

    // Optionally, you can add ownership check here if needed

    // Allow update if user is admin
    if (userRole !== "admin") {
      console.log("Unauthorized: user role is not admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingIdInt = parseInt(bookingId, 10)
    const updatedBooking = await prisma.bookings.update({
      where: { id: bookingIdInt },
      data: { status },
    })

    return NextResponse.json({ booking: updatedBooking }, { status: 200 })
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
  }
}
