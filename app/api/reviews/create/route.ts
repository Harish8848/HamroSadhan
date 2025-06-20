import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId, vehicleId, bookingId, rating, comment } = await request.json()

    if (!userId || !vehicleId || !bookingId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if booking status is completed before allowing review
    const bookingIdInt = parseInt(bookingId, 10)
    const vehicleIdInt = parseInt(vehicleId, 10)

    const booking = await prisma.bookings.findUnique({
      where: { id: bookingIdInt },
    })

    if (!booking || booking.status !== "completed") {
      return NextResponse.json(
        { error: "Review can only be created for completed bookings" },
        { status: 400 }
      )
    }

    const newReview = await prisma.reviews.create({
      data: {
        user_id: userId,
        vehicle_id: vehicleIdInt,
        booking_id: bookingIdInt,
        rating,
        comment: comment || null,
      },
    })

    return NextResponse.json(newReview)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
