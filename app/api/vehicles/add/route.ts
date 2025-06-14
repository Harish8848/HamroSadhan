import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { type, brand, model, price_per_day, fuel_type, status, image_url, name, description, location } = await request.json()

    if (!type || !brand || !model || price_per_day === undefined || !fuel_type || !status || !name || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newVehicle = await prisma.vehicles.create({
      data: {
        type,
        brand,
        model,
        price_per_day,
        fuel_type,
        status,
        image_url: image_url || null,
        name,
        description,
        location,
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
