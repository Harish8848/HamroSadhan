"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Bike, MapPin, Clock, Shield, Star, ChevronLeft, ChevronRight, Menu, X  } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"



export default function Home() {
  //slider

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  // Define a type for vehicle
  type Vehicle = {
    id: string | number
    type: string
    name: string
    image: string
    price: string
    features: string[]
    image_url?: string
    price_per_day?: number
  }

  // vehicles state fetched from API
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [vehiclesError, setVehiclesError] = useState<string | null>(null)

  // Fetch vehicles from API on mount
  useEffect(() => {
    async function fetchVehicles() {
      setLoadingVehicles(true)
      setVehiclesError(null)
      try {
        const res = await fetch("/api/vehicles")
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles")
        }
        const data = await res.json()
        // Map API data to slider expected format
        const mapped = data.map((v: {
          id: string | number
          type: string
          name: string
          image_url?: string
          price_per_day?: number
        }) => ({
          id: v.id,
          type: v.type,
          name: v.name,
          image: v.image_url || "/placeholder.svg",
          price: `Rs. ${v.price_per_day?.toLocaleString() ?? "N/A"}`,
          features: [], // API does not provide features, so empty array for now
        }))
        setVehicles(mapped)
      } catch (error) {
        setVehiclesError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoadingVehicles(false)
      }
    }
    fetchVehicles()
  }, [])

  // Filter vehicles based on activeFilter
  const filteredVehicles = vehicles.filter(
    (vehicle) => activeFilter === "all" || vehicle.type === activeFilter
  )

  // Slide auto-advance effect
  useEffect(() => {
    if (filteredVehicles.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredVehicles.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [filteredVehicles.length])

  const nextSlide = () => {
    if (filteredVehicles.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % filteredVehicles.length)
  }

  const prevSlide = () => {
    if (filteredVehicles.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + filteredVehicles.length) % filteredVehicles.length)
  }


  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const [localLoading, setLocalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setLocalLoading(true)
      async function confirmEmail() {
        try {
          const response = await fetch(`/api/auth/confirm-email?token=${token}`)
          const data = await response.json()
          if (!response.ok) {
            setError(data.error || "Failed to confirm email")
            setLocalLoading(false)
            return
          }
          toast({
            title: "Email confirmed successfully",
            description: "Welcome! You can now use the site.",
          })
          setConfirmed(true)
          setLocalLoading(false)
          router.push("/")
          // Optionally, refresh user data here if needed
        } catch (err) {
          setError("An unexpected error occurred")
          setLocalLoading(false)
        }
      }
      confirmEmail()
    }
  }, [searchParams, toast, router])


  if (loading || localLoading) {
    return <div className="container py-8 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-600">
        <p>Error: {error}</p>
        <Button onClick={() => router.push("/signup")}>Back to Signup</Button>
      </div>
    )
  }

  
  // Render homepage content
  return (    
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">

  {/* Hero Section with Background Video */}
  <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover brightness-150">
            <source src="/HamroSadhanBgVideo.mov" type="video/mp4" />
            {/* Fallback background */}
            <div className="w-full h-full bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight opacity-50">
            Your Journey,
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Wheels
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto opacity-50">
            Rent cars and bikes instantly in Nepal. Safe, affordable, and convenient transportation at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/vehicles?type=car">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 opacity-50 hover:opacity-100 transition-all duration-300">
              <Car className="w-5 h-5 mr-2 " />
              Rent a Car
            </Button>
            </Link>

            <Link href="/vehicles?type=bike">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3 bg-transparent opacity-50 hover:opacity-100 transition-all duration-300"
            >
              <Bike className="w-5 h-5 mr-2" />
              Rent a Bike
            </Button>
            </Link>
          </div>
        </div>

      </section>

        {/* Vehicle Slider Section */}
        <section id="vehicles" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Choose Your Ride</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From economy cars to premium bikes, find the perfect vehicle for your journey
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Vehicles
              </button>
              <button
                onClick={() => setActiveFilter("car")}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                  activeFilter === "car"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Car className="w-4 h-4" />
                Cars
              </button>
              <button
                onClick={() => setActiveFilter("bike")}
                className={`px-6 py-2 rounded-full transition-all duration[3000] flex items-center gap-2 ${
                  activeFilter === "bike"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Bike className="w-4 h-4" />
                Bikes
              </button>
            </div>
          </div>

          {/* Vehicle Slider */}
          <div className="relative max-w-8xl mx-auto ">
          <div className="overflow-hidden rounded-2xl">
            {loadingVehicles ? (
              <div className="text-center py-20 text-gray-500">Loading vehicles...</div>
            ) : vehiclesError ? (
              <div className="text-center py-20 text-red-600">Error: {vehiclesError}</div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No vehicles found.</div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {filteredVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="w-full flex-shrink-0">
                    <Card className="mx-4 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                      <div className="relative ">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={600}
                          height={600}
                          className="w-full h-64 object-contain  transition-transform duration-300 hover:scale-150 m-24" loading="lazy"
                        />
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600">
                          {vehicle.type === "car" ? (
                            <Car className="w-3 h-3 mr-1" />
                          ) : (
                            <Bike className="w-3 h-3 mr-1" />
                          )}
                          {vehicle.type.toUpperCase()}
                        </Badge>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-4">{vehicle.price}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vehicle.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Link href={`/vehicles/${vehicle.id}`} className="w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Book Now
                        </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {filteredVehicles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                Why Choose HamroSadhan?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We offer a wide range of vehicles at competitive prices with excellent customer service.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="rounded-full bg-red-100 p-3">
                <Car className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Wide Selection</h3>
              <p className="text-sm text-gray-500 text-center">
                Choose from a variety of cars and bikes to suit your needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Affordable Prices</h3>
              <p className="text-sm text-gray-500 text-center">
                Competitive rates in Nepali Rupees with no hidden fees.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Customer Satisfaction</h3>
              <p className="text-sm text-gray-500 text-center">
                Our priority is to ensure you have a great rental experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}