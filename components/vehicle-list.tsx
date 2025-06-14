"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { Car, Bike } from "lucide-react"

interface VehicleListProps {
  vehicles: Vehicle[]
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
        <p className="text-lg text-gray-500 mb-4">No vehicles found matching your criteria.</p>
        <Link href="/vehicles">
          <Button variant="outline">View All Vehicles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden">
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url || "/placeholder.svg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {vehicle.type === "car" ? (
                  <Car className="h-16 w-16 text-gray-400" />
                ) : (
                  <Bike className="h-16 w-16 text-gray-400" />
                )}
              </div>
            )}
            <Badge className={`absolute top-2 right-2 ${vehicle.type === "car" ? "bg-blue-500" : "bg-green-500"}`}>
              {vehicle.type === "car" ? "Car" : "Bike"}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>
                {vehicle.brand} {vehicle.model}
              </span>
              <Badge variant="outline" className="text-red-600 border-red-600">
                {vehicle.fuel_type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(vehicle.price_per_day)}
              <span className="text-sm font-normal text-gray-500">/day</span>
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/vehicles/${vehicle.id}`} className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
