import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing vehicle id" }, { status: 400 })
    }

    const parsedId = parseInt(id, 10)
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid vehicle id" }, { status: 400 })
    }

    await prisma.vehicles.delete({
      where: { id: parsedId },
    })

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
