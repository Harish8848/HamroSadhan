import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")
    const type = url.searchParams.get("type")
    const brand = url.searchParams.get("brand")
    const fuel_type = url.searchParams.get("fuel_type")
    const location = url.searchParams.get("location")
    const sortBy = url.searchParams.get("sortBy")

    const where: any = {}

    if (minPrice) {
      where.price_per_day = { gte: Number(minPrice) }
    }
    if (maxPrice) {
      where.price_per_day = where.price_per_day
        ? { ...where.price_per_day, lte: Number(maxPrice) }
        : { lte: Number(maxPrice) }
    }
    if (type) {
      where.type = type
    }
    if (brand) {
      where.brand = { contains: brand, mode: "insensitive" }
    }
    if (fuel_type) {
      where.fuel_type = fuel_type
    }
    if (location) {
      where.location_id = Number(location)
    }

    const orderBy: any = {}

    if (sortBy === "price_asc") {
      orderBy.price_per_day = "asc"
    } else if (sortBy === "price_desc") {
      orderBy.price_per_day = "desc"
    } else {
      orderBy.created_at = "desc"
    }

    const vehicles = await prisma.vehicles.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        model: true,
        type: true,
        brand: true,
        fuel_type: true,
        price_per_day: true,
        status: true,
        image_url: true,
        created_at: true,
        updated_at: true,
      },
      orderBy,
    })

    const mappedVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      id: vehicle.id.toString(),
      price_per_day: Number(vehicle.price_per_day),
      created_at: vehicle.created_at.toISOString(),
      updated_at: vehicle.updated_at.toISOString(),
    }))

    return NextResponse.json(mappedVehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}