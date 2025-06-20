import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    // If no userId, fetch all bookings (admin)
    const now = new Date()
    const bookings = userId
      ? await prisma.bookings.findMany({
          where: {
            user_id: userId,
            NOT: {
              AND: [
                { status: "confirmed" },
                { end_date: { lt: now } },
              ],
            },
          },
          orderBy: { created_at: "desc" },
          include: {
            vehicle: true,
            user: true,
          },
        })
      : await prisma.bookings.findMany({
          where: {
            NOT: {
              AND: [
                { status: "confirmed" },
                { end_date: { lt: now } },
              ],
            },
          },
          orderBy: { created_at: "desc" },
          include: {
            vehicle: true,
            user: true,
          },
        })

    const mappedBookings = bookings.map((booking) => ({
      ...booking,
      id: booking.id.toString(),
      user_id: booking.user_id.toString(),
      vehicle_id: booking.vehicle_id.toString(),
      start_date: booking.start_date.toISOString(),
      end_date: booking.end_date.toISOString(),
      created_at: booking.created_at.toISOString(),
      updated_at: booking.updated_at.toISOString(),
      total_cost: booking.total_cost.toNumber(),
      vehicle: {
        ...booking.vehicle,
        id: booking.vehicle.id.toString(),
        price_per_day: Number(booking.vehicle.price_per_day),
        created_at: booking.vehicle.created_at.toISOString(),
        updated_at: booking.vehicle.updated_at.toISOString(),
      },
      user: {
        ...booking.user,
        id: booking.user.id.toString(),
      },
    }))

    return NextResponse.json(mappedBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { vehicle_id, start_date, end_date, total_days, total_cost, user_id } = await request.json()

    if (!vehicle_id || !start_date || !end_date || !total_days || !total_cost || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const overlappingBookings = await prisma.bookings.findMany({
      where: {
        vehicle_id,
        status: { in: ["pending", "confirmed"] },
        OR: [
          {
            start_date: { lte: new Date(end_date) },
            end_date: { gte: new Date(start_date) },
          },
        ],
      },
    })

    if (overlappingBookings.length > 0) {
      return NextResponse.json({ error: "Vehicle is already booked for the selected dates" }, { status: 409 })
    }

    const newBooking = await prisma.bookings.create({
      data: {
        user_id,
        vehicle_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        total_days,
        total_cost: new Prisma.Decimal(total_cost),
        status: "pending",
      },
    })

    return NextResponse.json({
      ...newBooking,
      id: newBooking.id.toString(),
      user_id: newBooking.user_id.toString(),
      vehicle_id: newBooking.vehicle_id.toString(),
      start_date: newBooking.start_date.toISOString(),
      end_date: newBooking.end_date.toISOString(),
      created_at: newBooking.created_at.toISOString(),
      updated_at: newBooking.updated_at.toISOString(),
      total_cost: newBooking.total_cost.toNumber(),
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
