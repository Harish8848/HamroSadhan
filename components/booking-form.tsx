"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, calculateTotalDays, calculateTotalCost } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface BookingFormProps {
  vehicle: Vehicle
}

export function BookingForm({ vehicle }: BookingFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const totalDays = startDate && endDate ? calculateTotalDays(startDate.toISOString(), endDate.toISOString()) : 0
  const totalCost = calculateTotalCost(totalDays, vehicle.price_per_day)

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book a vehicle",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Date selection required",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    if (totalDays <= 0) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check if vehicle is available for the selected dates
      const availabilityResponse = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      })

      const availabilityData = await availabilityResponse.json()

      if (!availabilityResponse.ok || !availabilityData.available) {
        toast({
          title: "Vehicle not available",
          description: "This vehicle is already booked for the selected dates",
          variant: "destructive",
        })
        return
      }

      // Create booking
      const createResponse = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          vehicleId: vehicle.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalDays,
          totalCost,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      toast({
        title: "Booking successful",
        description: "Your booking has been submitted and is pending confirmation",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book this {vehicle.type}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Price per day:</span>
            <span>{formatCurrency(vehicle.price_per_day)}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of days:</span>
            <span>{totalDays}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total cost:</span>
            <span className="text-red-600">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={handleBooking}
          disabled={isLoading || !startDate || !endDate || totalDays <= 0}
        >
          {isLoading ? "Processing..." : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
