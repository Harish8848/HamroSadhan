"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminVehicles } from "@/components/admin-vehicles"
import { AdminBookings } from "@/components/admin-bookings"
import { AdminUsers } from "@/components/admin-users"
import AdminReviews from "@/components/admin-reviews"
import AdminLocations from "@/components/admin-locations"
import type { Vehicle, Booking, User } from "@/types"
import { Loader2, Users, Car, CalendarCheck, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define Location type to match admin-locations.tsx
type Location = {
  id: number
  name: string
  address: string
  city: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [locations, setLocations] = useState<Location[]>([])
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
        const [vehiclesRes, bookingsRes, usersRes, locationsRes] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/bookings"),
          fetch("/api/users"),
          fetch("/api/locations"),
        ])

        if (!vehiclesRes.ok || !bookingsRes.ok || !usersRes.ok || !locationsRes.ok) {
          throw new Error("Failed to fetch one or more resources")
        }

        const [vehiclesData, bookingsData, usersData, locationsData] = await Promise.all([
          vehiclesRes.json(),
          bookingsRes.json(),
          usersRes.json(),
          locationsRes.json(),
        ])

        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : [])
        const filteredBookings = Array.isArray(bookingsData) ? bookingsData.filter((b) => b.status !== "cancelled") : []
        setBookings(filteredBookings)
        setUsers(Array.isArray(usersData) ? usersData : [])
        setLocations(
          Array.isArray(locationsData)
            ? locationsData.map((loc) => ({
                id: typeof loc.id === "number" ? loc.id : Number(loc.id),
                name: loc.name,
                address: loc.address,
                city: loc.city,
              }))
            : []
        )

        setStats({
          totalUsers: usersData?.length || 0,
          totalVehicles: vehiclesData?.length || 0,
          activeBookings: filteredBookings.filter((b: Booking) => b.status === "confirmed").length,
        })
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setVehicles([])
        setBookings([])
        setUsers([])
        setLocations([])
        setStats({
          totalUsers: 0,
          totalVehicles: 0,
          activeBookings: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    setStats((prevStats) => ({
      ...prevStats,
      totalUsers: prevStats.totalUsers - 1,
    }))
  }

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
          <TabsTrigger value="locations">Locations</TabsTrigger>
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
          <AdminUsers users={users} onUserDeleted={handleUserDeleted} />
        </TabsContent>

        <TabsContent value="reviews">
          <AdminReviews />
        </TabsContent>

        <TabsContent value="locations">
          <AdminLocations locations={locations} setLocations={setLocations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
