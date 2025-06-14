"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VehicleFilter } from "@/types"

interface VehicleFiltersProps {
  initialFilters: VehicleFilter
  locations?: { id: string; name: string }[]
}

export function VehicleFilters({ initialFilters, locations }: VehicleFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<VehicleFilter>(initialFilters)

  // Update the URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams()

    // Convert "all" to undefined to avoid filtering by "all"
    if (filters.type) params.set("type", filters.type)
    if (filters.brand) params.set("brand", filters.brand)
    if (filters.fuel_type) params.set("fuel_type", filters.fuel_type)
    if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString())
    if (filters.sortBy) params.set("sortBy", filters.sortBy)
    if (filters.locationId !== undefined) params.set("location", filters.locationId.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({})
    router.push(pathname)
  }

  // Update local state when URL params change
  useEffect(() => {
    setFilters(initialFilters)
  }, [searchParams, initialFilters])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Vehicles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Vehicle Type</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) => setFilters({ ...filters, type: value === "all" ? undefined : (value as "car" | "bike" | undefined) })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {locations && locations.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={filters.locationId !== undefined ? String(filters.locationId) : "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, locationId: value === "all" ? undefined : Number(value) })
              }
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            placeholder="e.g. Honda, Toyota"
            value={filters.brand || ""}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select
            value={filters.fuel_type || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, fuel_type: value === "all" ? undefined : (value as "petrol" | "electric" | "diesel" | undefined) })
            }
          >
            <SelectTrigger id="fuel_type">
              <SelectValue placeholder="All Fuel Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price (NPR)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value ? Number.parseInt(e.target.value) : undefined })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price (NPR)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value ? Number.parseInt(e.target.value) : undefined })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) =>
              setFilters({ ...filters, sortBy: value === "newest" ? undefined : (value as "price_asc" | "price_desc" | undefined) })
            }
          >
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={applyFilters} className="bg-red-600 hover:bg-red-700">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
