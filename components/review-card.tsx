import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Review } from "@/types"
import { Star } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const safeFullName = review.user?.full_name ?? ""
  const safeCreatedAt = typeof review.created_at === "string" ? review.created_at : review.created_at.toISOString()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt={safeFullName || "User"} />
            <AvatarFallback>{safeFullName ? getInitials(safeFullName) : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{safeFullName || "Anonymous User"}</div>
            <div className="text-sm text-muted-foreground">{formatDate(safeCreatedAt)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        {review.comment && <p className="text-sm">{review.comment}</p>}
      </CardContent>
    </Card>
  )
}
