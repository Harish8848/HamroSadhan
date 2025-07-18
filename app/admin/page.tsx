"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminVehicles } from "@/components/admin-vehicles"
import { AdminBookings } from "@/components/admin-bookings"
import { AdminUsers } from "@/components/admin-users"
import AdminReviews from "@/components/admin-reviews"
import type { Vehicle, Booking, User } from "@/types"
import { UserProfile } from "@/components/user-profile"
import { Loader2, Users, Car, CalendarCheck } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    activeBookings: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "admin") return

      try {
        // Fetch vehicles
        const vehiclesRes = await fetch("/api/vehicles")
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData || [])

        // Fetch bookings
        const bookingsRes = await fetch("/api/bookings")
        const bookingsData = await bookingsRes.json()
        const filteredBookings = Array.isArray(bookingsData) ? bookingsData.filter((b) => b.status !== "cancelled") : []
        setBookings(filteredBookings)

        // Fetch users
        const usersRes = await fetch("/api/users")
        const usersData = await usersRes.json()
        setUsers(usersData || [])

        // Set stats
        setStats({
          totalUsers: usersData?.length || 0,
          totalVehicles: vehiclesData?.length || 0,
          activeBookings: Array.isArray(bookingsData) ? bookingsData.filter((b: Booking) => b.status === "confirmed").length : 0,
        })
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access the admin panel</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-red-600">Admin Dashboard</h1>

      <div className="mb-8 max-w-md">
        {/* <UserProfile user={user} /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <Users className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              <Car className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
              <CalendarCheck className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles">
        <TabsList className="mb-8">
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <AdminVehicles vehicles={vehicles} setVehicles={setVehicles} />
        </TabsContent>

          <TabsContent value="bookings">
          <AdminBookings bookings={bookings} refreshBookings={async () => {
            try {
              const bookingsRes = await fetch("/api/bookings")
              const bookingsData = await bookingsRes.json()
              const filteredBookings = Array.isArray(bookingsData) ? bookingsData.filter((b) => b.status !== "cancelled") : []
              setBookings(filteredBookings)
              setStats((prev) => ({
                ...prev,
                activeBookings: filteredBookings.filter((b) => b.status === "confirmed").length,
              }))
            } catch (error) {
              console.error("Error refreshing bookings:", error)
            }
          }} />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers users={users} />
        </TabsContent>

        <TabsContent value="reviews">
          <AdminReviews />
        </TabsContent>
      </Tabs>
    </div>
  );
}