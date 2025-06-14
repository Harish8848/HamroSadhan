"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { VehicleFilter } from "@/types"

export function VehicleFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [brands, setBrands] = useState<string[]>([])
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [maxPrice, setMaxPrice] = useState(10000)

  const [filters, setFilters] = useState<VehicleFilter>({
    type: (searchParams.get("type") as "car" | "bike") || undefined,
    brand: searchParams.get("brand") || undefined,
    fuel_type: (searchParams.get("fuel_type") as "petrol" | "electric" | "diesel") || undefined,
    locationId: searchParams.get("locationId") ? Number(searchParams.get("locationId")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: (searchParams.get("sortBy") as "price_asc" | "price_desc" | "rating" | "newest") || undefined,
    search: searchParams.get("search") || undefined,
  })

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch brands and max price
        const resBrands = await fetch("/api/vehicles/brands")
        const dataBrands = await resBrands.json()
        if (!resBrands.ok) throw new Error(dataBrands.error || "Failed to fetch brands")

        setBrands(dataBrands.brands)
        setMaxPrice(dataBrands.maxPrice)
        setPriceRange([filters.minPrice || 0, filters.maxPrice || dataBrands.maxPrice])

        // Fetch locations
        const resLocations = await fetch("/api/locations")
        const dataLocations = await resLocations.json()
        if (!resLocations.ok) throw new Error(dataLocations.error || "Failed to fetch locations")

        setLocations(dataLocations)
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [filters.minPrice, filters.maxPrice])

  const handleFilterChange = (key: keyof VehicleFilter, value: any) => {
    setFilters((prev: VehicleFilter) => ({ ...prev, [key]: value }))
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    setFilters((prev: VehicleFilter) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value))
      }
    })

    router.push(`/vehicles?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      type: undefined,
      brand: undefined,
      fuel_type: undefined,
      locationId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      search: undefined,
    })
    setPriceRange([0, maxPrice])
    router.push("/vehicles")
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div>
        <h3 className="font-medium mb-4">Search</h3>
        <Input
          placeholder="Search vehicles..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-medium mb-4">Vehicle Type</h3>
        <Select
          value={filters.type ?? undefined}
          onValueChange={(value) => handleFilterChange("type", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="bike">Bike</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-4">Brand</h3>
        <Select
          value={filters.brand ?? undefined}
          onValueChange={(value) => handleFilterChange("brand", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-4">Fuel Type</h3>
        <Select
          value={filters.fuel_type ?? undefined}
          onValueChange={(value) => handleFilterChange("fuel_type", value || undefined)}
        >
          <SelectTrigger>
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

      <div>
        <h3 className="font-medium mb-4">Location</h3>
        <Select
          value={filters.locationId?.toString() ?? undefined}
          onValueChange={(value) =>
            handleFilterChange("locationId", value ? Number(value) : undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <h3 className="font-medium">Price Range</h3>
          <span className="text-sm text-muted-foreground">
            NPR {priceRange[0]} - NPR {priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, maxPrice]}
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={handlePriceChange}
        />
      </div>

      <div>
        <h3 className="font-medium mb-4">Sort By</h3>
        <Select
          value={filters.sortBy ?? undefined}
          onValueChange={(value) => handleFilterChange("sortBy", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}
