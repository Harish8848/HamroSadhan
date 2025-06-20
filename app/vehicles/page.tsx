"use client"

import React, { useEffect, useState } from "react"
import { VehicleFilters } from "@/components/vehicle-filters"
import { VehicleList } from "@/components/vehicle-list"
import type { Vehicle, VehicleFilter } from "@/types"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Footer } from "@/components/footer"

type Location = {
  id: string
  name: string
}

export default function VehiclesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [locations, setLocations] = useState<Location[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<VehicleFilter>({
    type: undefined,
    brand: undefined,
    fuel_type: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
    locationId: undefined,
  })

  // Fetch locations for filter dropdown
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations")
        if (!res.ok) {
          throw new Error("Failed to fetch locations")
        }
        const data = await res.json()
        setLocations(data.map((loc: any) => ({ id: loc.id.toString(), name: loc.name })))
      } catch (err: any) {
        setError(err.message || "Unknown error")
      }
    }
    fetchLocations()
  }, [])

  // Update filters from URL search params
  useEffect(() => {
    const type = searchParams.get("type") || undefined
    const brand = searchParams.get("brand") || undefined
    const fuel_type = searchParams.get("fuel_type") || undefined
    const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined
    const sortBy = searchParams.get("sortBy") as "price_asc" | "price_desc" | undefined
    const locationId = searchParams.get("location") ? Number.parseInt(searchParams.get("location")!) : undefined

    setFilters({
      type: type === "all" ? undefined : (type as "car" | "bike" | undefined),
      brand,
      fuel_type: fuel_type === "all" ? undefined : (fuel_type as "petrol" | "electric" | "diesel" | undefined),
      minPrice,
      maxPrice,
      sortBy,
      locationId,
    })
  }, [searchParams])

  // Fetch vehicles based on filters
  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.type) params.set("type", filters.type)
        if (filters.brand) params.set("brand", filters.brand)
        if (filters.fuel_type) params.set("fuel_type", filters.fuel_type)
        if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString())
        if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString())
        if (filters.sortBy) params.set("sortBy", filters.sortBy)
        if (filters.locationId !== undefined) params.set("location", filters.locationId.toString())

        const res = await fetch(`/api/vehicles?${params.toString()}`)
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles")
        }
        const data = await res.json()
        // Map data to full Vehicle type with required fields
        setVehicles(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [filters])

  if (loading) {
    return <div className="container mx-auto py-8">Loading vehicles...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-600">Error: {error}</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-red-600">Available Vehicles</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <VehicleFilters initialFilters={filters} locations={locations} />
        </div>
        <div className="md:col-span-3">
          <VehicleList vehicles={vehicles} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
