"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star, Search, MoreHorizontal, XCircle, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
  ))
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const [ratingTypeFilter, setRatingTypeFilter] = useState("all")

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/admin")
        if (!res.ok) throw new Error("Failed to fetch reviews")
        const data = await res.json()
        setReviews(data)
      } catch (error) {
        console.error("Error fetching admin reviews:", error)
      }
    }
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesRatingType = true
    if (ratingTypeFilter === "high") {
      matchesRatingType = review.rating >= 4
    } else if (ratingTypeFilter === "low") {
      matchesRatingType = review.rating <= 2
    } else if (ratingTypeFilter === "medium") {
      matchesRatingType = review.rating === 3
    }

    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesRatingType && matchesRating
  })

  const handleResponse = () => {
    // Handle admin response logic here
    console.log("Response sent:", responseText)
    setResponseText("")
    setSelectedReview(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
          <p className="text-gray-600">Monitor and manage customer reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Ratings (4-5★)</p>
                  <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.rating >= 4).length}</p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Ratings (1-2★)</p>
                  <p className="text-2xl font-bold text-red-600">{reviews.filter((r) => r.rating <= 2).length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reviews, users, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={ratingTypeFilter} onValueChange={setRatingTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Rating Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="high">High Ratings (4-5★)</SelectItem>
                  <SelectItem value="medium">Medium Ratings (3★)</SelectItem>
                  <SelectItem value="low">Low Ratings (1-2★)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>
                        {review.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.user.email}</p>
                      <p className="text-sm font-medium text-gray-800 mb-2">{review.product}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-600">
                          {review.rating}/5 • {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Respond to Review
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Respond to Review</DialogTitle>
                              <DialogDescription>
                                Send a response to {review.user.name}
                                {"'"}s review
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium mb-1">{review.title}</p>
                                <p className="text-sm text-gray-600">{review.content}</p>
                              </div>
                              <Textarea
                                placeholder="Type your response here..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setResponseText("")}>
                                Cancel
                              </Button>
                              <Button onClick={handleResponse}>Send Response</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.helpful} people found this helpful</span>
                  <span>Review ID: #{review.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
