import { notFound } from "next/navigation"
// import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { VehicleDetails } from "@/components/vehicle-details"
import type { Vehicle } from "@/types"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getVehicle(id: string): Promise<Vehicle | null> {
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: Number(id) },
  })

  if (!vehicle) {
    return null
  }

  return {
    ...vehicle,
    id: vehicle.id.toString(),
    type: vehicle.type as "car" | "bike",
    fuel_type: vehicle.fuel_type as "petrol" | "electric" | "diesel",
    status: vehicle.status as "available" | "rented" | "maintenance",
    price_per_day: Number(vehicle.price_per_day),
    created_at: vehicle.created_at.toISOString(),
  }
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params
  const vehicle = await getVehicle(awaitedParams.id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}

      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <VehicleDetails vehicle={vehicle} />
            </div>
            <div className="md:col-span-1">
              <BookingForm vehicle={vehicle} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
