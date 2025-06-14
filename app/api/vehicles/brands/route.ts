import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch distinct brands
    const brands = await prisma.vehicles.findMany({
      distinct: ["brand"],
      select: { brand: true },
      orderBy: { brand: "asc" },
    })

    // Fetch max price_per_day
    const maxPriceVehicle = await prisma.vehicles.findFirst({
      orderBy: { price_per_day: "desc" },
      select: { price_per_day: true },
    })

    const maxPrice = maxPriceVehicle ? Math.ceil(Number(maxPriceVehicle.price_per_day) / 1000) * 1000 : 10000

    return NextResponse.json({
      brands: brands.map((b) => b.brand),
      maxPrice,
    })
  } catch (error) {
    console.error("Error fetching brands and max price:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
