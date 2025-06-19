import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  // Adapted for Next.js App Router: extract cookies and headers from request
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
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 });
    }

    // Optionally, you can add ownership check here if needed

    // Allow update if user is admin
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
