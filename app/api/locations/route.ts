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
      vehicles: location.vehicles.map(vehicle => ({
        ...vehicle,
        id: vehicle.id.toString(),
        type: vehicle.type,
        available: vehicle.status === "available",
      })),
    }))

    return NextResponse.json(mappedLocations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, id, name, address, city } = body

    if (action === "add") {
      if (!name || !address || !city) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }
      // Remove id from data to avoid unique constraint error
      const newLocation = await prisma.locations.create({
        data: {
          name,
          address,
          city,
        },
      })
      return NextResponse.json(newLocation)
    }

    if (action === "update") {
      if (!id || !name || !address || !city) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }
      const updatedLocation = await prisma.locations.update({
        where: { id: Number(id) },
        data: {
          name,
          address,
          city,
        },
      })
      return NextResponse.json(updatedLocation)
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "Missing id for delete" }, { status: 400 })
      }
      await prisma.locations.delete({
        where: { id: Number(id) },
      })
      return NextResponse.json({ message: "Location deleted" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error handling POST request for locations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
