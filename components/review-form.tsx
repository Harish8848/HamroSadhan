"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Star } from "lucide-react"

interface ReviewFormProps {
  vehicleId: number
  bookingId: number
}

export function ReviewForm({ vehicleId, bookingId }: ReviewFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = React.useState(0)
  const [hoveredRating, setHoveredRating] = React.useState(0)
  const [comment, setComment] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
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
          userId: user.id,
          vehicleId,
          bookingId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      router.push(`/vehicles/${vehicleId}`)
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "An error occurred while submitting your review",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="font-medium">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  (hoveredRating ? star <= hoveredRating : star <= rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="font-medium">
          Your Review (Optional)
        </label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this vehicle..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
        />
      </div>

      <Button type="submit" disabled={isLoading || rating === 0}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
