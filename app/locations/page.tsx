
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Car, Bike, Search, AlertCircle, Navigation, Phone, Clock, Users } from "lucide-react"
import { Footer } from "@/components/footer"

type Vehicle = {
  id: string
  name: string
  type?: "car" | "bike" | "scooter" | "jeep"
  available?: boolean
  // Add other vehicle fields as needed
}

type Location = {
  id: string
  name: string
  address: string
  city: string
  phone?: string
  hours?: string
  vehicles: Vehicle[]
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations")
        if (!res.ok) {
          throw new Error("Failed to fetch locations")
        }
        const data = await res.json()

        setLocations(data)
        setFilteredLocations(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  useEffect(() => {
    const filtered = locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredLocations(filtered)
  }, [searchTerm, locations])

  const getVehicleIcon = (type: string) => {
    return type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />
  }

  const getVehicleStats = (vehicles: Vehicle[]) => {
    const cars = vehicles.filter((v) => v.type === "car" || v.type === "jeep").length
    const bikes = vehicles.filter((v) => v.type === "bike" || v.type === "scooter").length
    const available = vehicles.filter((v) => v.available !== false).length
    return { cars, bikes, available, total: vehicles.length }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Locations</h2>
              <p className="text-gray-600 text-center mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Our Locations</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl">
            Find HamroSadhan rental services across Nepal. We're strategically located in major cities and tourist
            destinations to serve you better.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{locations.length}</div>
            <div className="text-sm text-gray-600">Total Locations</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {locations.reduce((acc, loc) => acc + loc.vehicles.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {locations.reduce((acc, loc) => acc + loc.vehicles.filter((v) => v.type === "car" || v.type === "jeep").length, 0)}
            </div>
            <div className="text-sm text-gray-600">Cars Available</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {locations.reduce((acc, loc) => acc + loc.vehicles.filter((v) => v.type === "bike" || v.type === "scooter").length, 0)}
            </div>
            <div className="text-sm text-gray-600">Bikes Available</div>
          </Card>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-600">
                {searchTerm ? `No locations match "${searchTerm}"` : "No locations available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => {
              const stats = getVehicleStats(location.vehicles)
              return (
                <Card key={location.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-1">{location.name}</CardTitle>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{location.address}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {location.city}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      {location.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{location.phone}</span>
                        </div>
                      )}
                      {location.hours && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{location.hours}</span>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Stats */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Vehicle Availability</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{stats.cars}</div>
                          <div className="text-xs text-gray-600">Cars</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{stats.bikes}</div>
                          <div className="text-xs text-gray-600">Bikes</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{stats.available}</div>
                          <div className="text-xs text-gray-600">Available</div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicles List */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Available Vehicles:</h4>
                      {location.vehicles.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No vehicles available</p>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {location.vehicles.map((vehicle) => (
                            <div
                              key={vehicle.id}
                              className="flex items-center justify-between text-sm p-2 bg-white rounded border"
                            >
                              <div className="flex items-center gap-2">
                                {getVehicleIcon(vehicle.type || "car")}
                                <span className="font-medium">{vehicle.name}</span>
                              </div>
                              <Badge
                                variant={vehicle.available !== false ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {vehicle.available !== false ? "Available" : "Rented"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Can't Find a Location Near You?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We&apos;re expanding across Nepal! Contact us to suggest a new location or inquire about vehicle delivery
              services in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="bg-slate-950 text-white">
                Request New Location
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    <Footer />
    </div>
  )
}
