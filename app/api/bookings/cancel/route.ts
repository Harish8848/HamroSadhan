import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !token.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = token.sub
  const userRole = (token as any).role

  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    const bookingIdInt = parseInt(bookingId, 10)

    // Verify booking belongs to user or user is admin
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingIdInt },
    })

    if (!booking || (booking.user_id !== userId && userRole !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Prevent cancellation if booking is confirmed or completed
    if (booking.status === "confirmed" || booking.status === "completed") {
      return NextResponse.json(
        { error: "Cannot cancel a booking that is confirmed or completed" },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.bookings.update({
      where: { id: bookingIdInt },
      data: { status: "cancelled" },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
