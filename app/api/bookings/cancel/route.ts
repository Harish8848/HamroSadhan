import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") || ""
  const url = new URL(request.url)
  const req = {
    headers: {
      cookie,
    },
    url: url.toString(),
  } as any

  const res = {
    getHeader() {
      return null
    },
    setHeader() {},
  } as any

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as { id: string, role: string }).id
  const userRole = (session.user as { id: string, role: string }).role

  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    // Verify booking belongs to user or user is admin
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
    })

    if (!booking || (booking.user_id !== userId && userRole !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.bookings.update({
      where: { id: bookingId },
      data: { status: "cancelled" },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
