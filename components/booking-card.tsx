"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Booking } from "@/types"
import { Calendar, Car, Bike } from "lucide-react"

interface BookingCardProps {
  booking: Booking
  onCancelBooking?: (id: string) => void
  isLoading?: boolean
}

export function BookingCard({ booking, onCancelBooking, isLoading }: BookingCardProps) {
  const statusColors = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 aspect-video md:aspect-square">
          <Image
            src={booking.vehicle?.image_url || "/placeholder.svg?height=200&width=200"}
            alt={booking.vehicle?.name || "Vehicle"}
            className="object-cover"
            fill
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-lg">{booking.vehicle?.name}</h3>
              <p className="text-muted-foreground text-sm">
                {booking.vehicle?.brand} {booking.vehicle?.model}
              </p>
            </div>
            <Badge className={`${statusColors[booking.status as keyof typeof statusColors] ?? "bg-gray-500"} text-white`}>
              {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Booking Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>From: {formatDate(booking.start_date as string)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>To: {formatDate(booking.end_date as string)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {booking.vehicle?.type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                  <span>
                    {booking.vehicle?.type ? booking.vehicle.type.charAt(0).toUpperCase() + booking.vehicle.type.slice(1) : "Unknown"} •
                    {booking.vehicle?.fuel_type ? booking.vehicle.fuel_type.charAt(0).toUpperCase() + booking.vehicle.fuel_type.slice(1) : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Payment Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Price per day:</span>
                  <span>{booking.total_days && booking.total_cost ? formatCurrency(Number(booking.total_cost)) : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days:</span>
                  <span>{booking.total_days ?? "-"}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(booking.total_cost ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-end">
        <Button variant="outline" asChild>
          <Link href={`/vehicles/${booking.vehicle_id}`}>View Vehicle</Link>
        </Button>

        {booking.status === "pending" && onCancelBooking && (
          <Button variant="destructive" onClick={() => onCancelBooking(booking.id)} disabled={isLoading}>
            Cancel Booking
          </Button>
        )}

        {booking.status === "completed" && (
          <Button asChild>
            <Link href={`/reviews/add?booking=${booking.id}&vehicle=${booking.vehicle_id}`}>Leave Review</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
