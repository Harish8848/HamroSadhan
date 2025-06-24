import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Find all booking IDs for the user
    const userBookings = await prisma.bookings.findMany({
      where: { user_id: userId },
      select: { id: true },
    })
    const bookingIds = userBookings.map(booking => booking.id)

    // Delete reviews related to those bookings
    await prisma.reviews.deleteMany({
      where: { booking_id: { in: bookingIds } },
    })

    // Delete all bookings related to the user
    await prisma.bookings.deleteMany({
      where: { user_id: userId },
    })

    // Delete user from database
    await prisma.users.delete({
      where: { id: userId },
    })

    // TODO: Delete user from auth system if applicable

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
