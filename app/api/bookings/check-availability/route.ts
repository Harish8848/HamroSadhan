import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { vehicleId, startDate, endDate } = await request.json()

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingBookings = await prisma.bookings.findMany({
      where: {
        vehicle_id: Number(vehicleId),
        status: { in: ["pending", "confirmed"] },
        OR: [
          {
            start_date: { lte: new Date(endDate) },
            end_date: { gte: new Date(startDate) },
          },
        ],
      },
    })

    return NextResponse.json({ available: existingBookings.length === 0 })
  } catch (error) {
    console.error("Error checking booking availability:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
