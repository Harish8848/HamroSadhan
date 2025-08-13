import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma"; // Fixed import for prisma

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Missing bookingId or status" },
        { status: 400 }
      );
    }

    // Find the booking by bookingId
    const booking = await prisma.bookings.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.user_id !== session.user.id && (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "You are not authorized to update this booking" },
        { status: 403 }
      );
    }

    // Now, update the booking
    const updatedBooking = await prisma.bookings.update({
      where: { id: booking.id },
      data: { status: status },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
