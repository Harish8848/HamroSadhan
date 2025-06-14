import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId, vehicleId, startDate, endDate, totalDays, totalCost } = await request.json()

    if (!userId || !vehicleId || !startDate || !endDate || !totalDays || !totalCost) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newBooking = await prisma.bookings.create({
      data: {
        user_id: userId,
        vehicle_id: Number(vehicleId),
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        total_days: totalDays,
        total_cost: totalCost,
        status: "pending",
      },
    })

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
