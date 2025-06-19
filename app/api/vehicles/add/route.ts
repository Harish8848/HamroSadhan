import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received request body:", body)
    let { type, brand, model, price_per_day, fuel_type, status, image_url, name, description, location_id } = body

    // Validate required fields except name, description, location_id
    if (!type || !brand || !model || price_per_day === undefined || !fuel_type || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate location_id: must be a valid integer
    if (location_id === undefined || location_id === null || location_id === "" || isNaN(Number(location_id))) {
      return NextResponse.json({ error: "Invalid or missing location_id" }, { status: 400 })
    }
    location_id = Number(location_id)

    // Provide default values for name and description if missing or empty
    if (!name || name.trim() === "") {
      name = `${brand} ${model}`
    }
    if (!description || description.trim() === "") {
      description = "No description provided."
    }

    const newVehicle = await prisma.vehicles.create({
      data: {
        type,
        brand,
        model,
        price_per_day: Number(price_per_day),
        fuel_type,
        status,
        image_url: image_url || "",
        name,
        description,
        location_id,
      },
    })

    return NextResponse.json({
      ...newVehicle,
      id: newVehicle.id.toString(),
    })
  } catch (error) {
    console.error("Error adding vehicle:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
