import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicleId")

    if (!vehicleId) {
      return NextResponse.json({ error: "Missing vehicleId parameter" }, { status: 400 })
    }

    const vehicleIdInt = parseInt(vehicleId, 10)

    const reviews = await prisma.reviews.findMany({
      where: { vehicle_id: vehicleIdInt },
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { reviewId, userId } = await request.json()

    if (!reviewId || !userId) {
      return NextResponse.json({ error: "Missing reviewId or userId" }, { status: 400 })
    }

    // Verify the review belongs to the user
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this review" }, { status: 403 })
    }

    await prisma.reviews.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
