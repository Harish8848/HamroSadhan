"use client"


import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Car, Bike, Calendar, AlertCircle, Star } from "lucide-react"
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
    id: string
    brand: string
    model: string
    type: string
    fuel_type: string
  }
}

interface BookingListProps {
  bookings: Booking[]
}

import { useAuth } from "@/contexts/auth-context"

export function BookingList({ bookings }: BookingListProps) {
  const { user } = useAuth()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const { toast } = useToast()

  const [vehicleReviews, setVehicleReviews] = useState<Record<string, Review[]>>({})

  interface Review {
    id: string
    rating: number
    comment: string | null
  }

  const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
            aria-label={`${star} Star`}
          >
            {star <= rating ? (
              <Star className="h-8 w-8 text-yellow-400" />
            ) : (
              <Star className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    )
  }

  useEffect(() => {
    async function fetchReviews() {
      const reviewsMap: Record<string, Review[]> = {}
      for (const booking of bookings) {
        const vehicleId = booking.vehicle?.id
        if (!vehicleId) continue
        if (reviewsMap[vehicleId]) continue // already fetched

        try {
          const res = await fetch(`/api/reviews?vehicleId=${vehicleId}`)
          if (!res.ok) throw new Error("Failed to fetch reviews")
          const data: Review[] = await res.json()
          reviewsMap[vehicleId] = data
        } catch (error) {
          console.error("Error fetching reviews for vehicle", vehicleId, error)
          reviewsMap[vehicleId] = []
        }
      }
      setVehicleReviews(reviewsMap)
    }

    fetchReviews()
  }, [bookings])

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

  // Render reviews for a vehicle
  const renderReviews = (vehicleId: string) => {
    const reviews = vehicleReviews[vehicleId] || []
    if (reviews.length === 0) return <p className="text-sm text-gray-500">No reviews yet.</p>

    return (
      <div className="space-y-2 mt-2">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded p-2 bg-gray-50">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {review.comment && <p className="text-sm text-gray-700 mt-1">{review.comment}</p>}
          </div>
        ))}
      </div>
    )
  }

  const handleOpenReviewDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setReviewRating(0)
    setReviewComment("")
    setIsReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedBooking) return
    if (reviewRating <= 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // fixed: use user id from context
          vehicleId: selectedBooking.vehicle?.id,
          bookingId: selectedBooking.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      })

      setIsReviewDialogOpen(false)
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

              {booking.status === "completed" && (
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleOpenReviewDialog(booking)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Give Review
                </Button>
              )}

              {/* Render reviews for this vehicle */}
              {booking.vehicle?.id && renderReviews(booking.vehicle.id)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cancel Booking Dialog */}
      <Dialog open={!!selectedBooking && !isReviewDialogOpen} onOpenChange={(open) => !open && setSelectedBooking(null)}>
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

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={(open) => !open && setIsReviewDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give a Review</DialogTitle>
            <DialogDescription>Share your experience with this vehicle</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating (1 to 5)
              </label>
              <StarRating rating={reviewRating} setRating={setReviewRating} />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment (optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmitReview} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
