import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId, vehicleId, bookingId, rating, comment } = await request.json()

    if (!userId || !vehicleId || !bookingId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newReview = await prisma.reviews.create({
      data: {
        user_id: userId,
        vehicle_id: vehicleId,
        booking_id: bookingId,
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
