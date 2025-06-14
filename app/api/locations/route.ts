import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const locations = await prisma.locations.findMany({
      orderBy: { name: "asc" },
      include: {
        vehicles: true,
      },
    })

    const mappedLocations = locations.map((location) => ({
      ...location,
      id: location.id.toString(),
      // phone and hours are not in DB, so leave as undefined or omit
      vehicles: location.vehicles.map(vehicle => ({
        ...vehicle,
        id: vehicle.id.toString(),
        type: vehicle.type, // map vehicle type
        available: vehicle.status === "available", // map availability from status
      })),
    }))

    return NextResponse.json(mappedLocations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
