import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const {
      id,
      type,
      brand,
      model,
      price_per_day,
      fuel_type,
      status,
      image_url,
      name,
      description,
      location_id,
    } = await request.json()

    // Validate required fields except image_url, name, description
    if (
      !id ||
      !type ||
      !brand ||
      !model ||
      price_per_day === undefined ||
      !fuel_type ||
      !status ||
      location_id === undefined ||
      location_id === null ||
      isNaN(Number(location_id))
    ) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    const locId = Number(location_id)

    console.log("Received location_id:", location_id, "converted to:", locId)
    // Check if location_id exists in locations table
    const locationExists = await prisma.locations.findUnique({
      where: { id: locId },
    })
    console.log("Location exists:", locationExists)

    if (!locationExists) {
      return NextResponse.json({ error: "Invalid location_id: location does not exist" }, { status: 400 })
    }

    // Provide default values for name and description if missing or empty
    const vehicleName = name && name.trim() !== "" ? name : `${brand} ${model}`
    const vehicleDescription = description && description.trim() !== "" ? description : "No description provided."

    const vehicleId = Number(id)

    const updatedVehicle = await prisma.vehicles.update({
      where: { id: vehicleId },
      data: {
        type,
        brand,
        model,
        price_per_day: Number(price_per_day),
        fuel_type,
        status,
        image_url: image_url || "",
        name: vehicleName,
        description: vehicleDescription,
        location_id: locId,
      },
    })

    return NextResponse.json({
      ...updatedVehicle,
      id: updatedVehicle.id.toString(),
    })
  } catch (error) {
    console.error("Error updating vehicle:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
