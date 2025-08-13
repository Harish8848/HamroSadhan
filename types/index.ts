export interface User {
  id: string
  full_name?: string | null
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  phone?: string | null
  created_at: string | Date
updated_at: string | Date
}

export interface Vehicle {
  id: string
  brand: string 
  model: string
  type:  string
  fuel_type: string
  status: "available" | "rented" | "maintenance"
  price_per_day: number
  created_at: string | Date
  updated_at: string | Date
  image_url?: string
  name?: string
  description?: string
  location?: {
    name: string
  }
  average_rating?: number
}

export interface Booking {
  id: string
  user_id: string
  vehicle_id: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  total_cost: number
  total_days?: number
  transaction_uuid?: string | null
  status: string
  vehicle: Vehicle
  user: User
}

export interface VehicleFilter {
  type?: "car" | "bike" | "scooter" | undefined
  brand?: string | undefined
  fuel_type?: "petrol" | "electric" | "diesel" | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | undefined
  locationId?: number | undefined
  search?: string | undefined
}

export interface Review {
  id: string
  user?: User | null
  rating: number
  comment?: string | null
  created_at: string | Date
}
