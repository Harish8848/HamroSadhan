"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { Users, Car, CalendarCheck, AlertCircle } from "lucide-react"
import prisma from "lib/prisma"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    activeBookings: 0,
    maintenanceVehicles: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)

      try {
        // Get total users
        const totalUsers = await prisma.users.count()

        // Get total vehicles
        const totalVehicles = await prisma.vehicles.count()

        // Get active bookings
        const activeBookings = await prisma.bookings.count({
          where: {
            status: {
              in: ["pending", "confirmed"],
            },
          },
        })

        // Get maintenance vehicles
        const maintenanceVehicles = await prisma.vehicles.count({
          where: {
            status: "maintenance",
          },
        })

        setStats({
          totalUsers,
          totalVehicles,
          activeBookings,
          maintenanceVehicles,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered users in the system</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalVehicles}</div>
          <p className="text-xs text-muted-foreground">Cars and bikes in the fleet</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeBookings}</div>
          <p className="text-xs text-muted-foreground">Pending and confirmed bookings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.maintenanceVehicles}</div>
          <p className="text-xs text-muted-foreground">Vehicles currently unavailable</p>
        </CardContent>
      </Card>
    </div>
  )
}
