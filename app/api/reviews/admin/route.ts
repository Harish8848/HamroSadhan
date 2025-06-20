import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const reviews = await prisma.reviews.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
      },
    })

    // Map reviews to match admin UI expected fields
    const mappedReviews = reviews.map((review) => ({
      id: review.id,
      user: {
        name: review.user?.full_name || "Unknown User",
        email: review.user?.email || "",
        avatar: "/placeholder.svg",
      },
      product: review.vehicle ? `${review.vehicle.brand} ${review.vehicle.model}` : "Unknown Vehicle",
      rating: review.rating,
      title: "",
      content: review.comment || "",
      date: review.created_at ? review.created_at.toISOString().split("T")[0] : "",
      helpful: 0, // Placeholder, adjust if you have helpful count
      verified: true, // Placeholder, adjust if you have verified status
    }))

    return NextResponse.json(mappedReviews)
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
