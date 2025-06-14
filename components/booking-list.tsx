"use client"


import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Car, Bike, Calendar, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Booking {
  id: string
  start_date: string
  end_date: string
  status: string
  total_cost: number
  vehicle?: {
    brand: string
    model: string
    type: string
    fuel_type: string
  }
}

interface BookingListProps {
  bookings: Booking[]
}

export function BookingList({ bookings }: BookingListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCancelBooking = async () => {
    if (!selectedBooking) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: selectedBooking.id, status: "cancelled" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to cancel booking")
      }

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      })

      setSelectedBooking(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Bookings</CardTitle>
          <CardDescription>You haven't made any bookings yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {booking.vehicle?.brand} {booking.vehicle?.model}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(booking.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(booking.end_date), "MMM d, yyyy")}
                  </CardDescription>
                </div>
                <Badge
                  className={`
                    ${booking.status === "pending" ? "bg-yellow-500" : ""}
                    ${booking.status === "confirmed" ? "bg-green-500" : ""}
                    ${booking.status === "completed" ? "bg-blue-500" : ""}
                    ${booking.status === "cancelled" ? "bg-gray-500" : ""}
                  `}
                >
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                {booking.vehicle?.type === "car" ? (
                  <Car className="h-4 w-4 text-gray-500" />
                ) : (
                  <Bike className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-500">
                  {booking.vehicle?.type === "car" ? "Car" : "Bike"} • {booking.vehicle?.fuel_type}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {Math.ceil(
                      (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
                <span className="font-bold text-red-600">{formatCurrency(booking.total_cost)}</span>
              </div>

              {booking.status === "pending" && (
                <Button
                  variant="outline"
                  className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => setSelectedBooking(booking)}
                >
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)} disabled={isLoading}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={isLoading}>
              {isLoading ? "Cancelling..." : "Yes, Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
