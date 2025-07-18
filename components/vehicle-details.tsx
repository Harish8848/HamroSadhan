"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { Car, Bike, Fuel, Calendar } from "lucide-react"
import Image from "next/image"

interface VehicleDetailsProps {
  vehicle: Vehicle
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <Card>
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {vehicle.type === "car" ? (
              <Car className="h-24 w-24 text-gray-400" />
            ) : (
              <Bike className="h-24 w-24 text-gray-400" />
            )}
          </div>
        )}
        <Badge className={`absolute top-4 left-4 ${vehicle.type === "car" ? "bg-blue-500" : "bg-green-500"}`}>
          {vehicle.type === "car" ? "Car" : "Bike"}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <Badge variant="outline" className="text-red-600 border-red-600">
            {vehicle.fuel_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-red-600">
            {formatCurrency(vehicle.price_per_day)}
            <span className="text-sm font-normal text-gray-500">/day</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            {vehicle.type === "car" ? (
              <Car className="h-5 w-5 text-gray-500" />
            ) : (
              <Bike className="h-5 w-5 text-gray-500" />
            )}
            <span>{vehicle.type === "car" ? "Car" : "Bike"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="h-5 w-5 text-gray-500" />
            <span>{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>Available Now</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600">
            {vehicle.description ||
              `Experience the ${vehicle.brand} ${vehicle.model} - a reliable and comfortable ${vehicle.type} with ${vehicle.fuel_type} engine. Perfect for your journey in Nepal.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
