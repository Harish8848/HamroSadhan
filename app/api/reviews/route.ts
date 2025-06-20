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
