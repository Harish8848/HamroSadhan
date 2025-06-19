"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import type { Booking } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Bike, Calendar, User, Edit } from "lucide-react"

interface AdminBookingsProps {
  bookings: Booking[]
  refreshBookings?: () => Promise<void>
}

export function AdminBookings({ bookings = [], refreshBookings }: AdminBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookingId: selectedBooking.id, status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update booking status")
      }

      toast({
        title: "Booking updated",
        description: `Booking status has been updated to ${newStatus}`,
      })

      setIsUpdateDialogOpen(false)
      setSelectedBooking(null)

      // Refresh bookings list after update
      if (refreshBookings) {
        await refreshBookings()
      }
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

  const handleCancelBooking = async (bookingId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookingId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to cancel booking")
      }

      toast({
        title: "Booking cancelled",
        description: "The booking has been successfully cancelled.",
      })

      // Refresh bookings list after cancellation
      if (refreshBookings) {
        await refreshBookings()
      }
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

  const openUpdateDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setNewStatus(booking.status)
    setIsUpdateDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Bookings</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{booking.user?.full_name || "Unknown User"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {booking.vehicle?.type === "car" ? (
                        <Car className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Bike className="h-4 w-4 text-gray-500" />
                      )}
                      <span>
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(new Date(booking.start_date), "MMM d")} -{" "}
                        {format(new Date(booking.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(booking.total_cost)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "pending"
                          ? "outline"
                          : booking.status === "confirmed"
                          ? "secondary"
                          : booking.status === "completed"
                          ? "default"
                          : booking.status === "cancelled"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openUpdateDialog(booking)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={isLoading}
                      title="Cancel Booking"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>Change the status of this booking</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4 space-y-4">
              <div>
                <p className="font-medium">
                  {selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.model}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(selectedBooking.start_date), "MMM d, yyyy")} -{" "}
                  {format(new Date(selectedBooking.end_date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleUpdateStatus}
              disabled={isLoading || !newStatus}
            >
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
