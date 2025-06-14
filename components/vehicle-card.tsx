import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Bike, MapPin, Fuel, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Vehicle } from "@/types"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusColor = {
    available: "bg-green-500",
    rented: "bg-amber-500",
    maintenance: "bg-red-500",
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-white text-xs font-medium ${statusColor[vehicle.status]}`}
        >
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </div>
        <Image
          src={vehicle.image_url ?? "/placeholder.svg?height=225&width=400"}
          alt={vehicle.name ?? "Vehicle image"}
          className="object-cover"
          fill
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{vehicle.name ?? "Unknown Vehicle"}</h3>
            <p className="text-muted-foreground text-sm">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
          <Badge variant={vehicle.type === "car" ? "default" : "secondary"}>
            {vehicle.type === "car" ? <Car className="h-3 w-3 mr-1" /> : <Bike className="h-3 w-3 mr-1" />}
            {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-1" />
            {vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}
          </div>
          {vehicle.location?.name && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {vehicle.location.name}
            </div>
          )}
          {typeof vehicle.average_rating === "number" && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {vehicle.average_rating.toFixed(1)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-lg">
          {formatCurrency(vehicle.price_per_day)}
          <span className="text-xs font-normal text-muted-foreground">/day</span>
        </div>
        <Button asChild>
          <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
