"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Bike } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function Home() {
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
  }, [searchParams, toast])

  useEffect(() => {
    
      if (!user) {
        router.push("/login")
      }

    
  }, [loading, user, confirmed, router])

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-red-600">
                  HamroSadhan - Your Trusted Vehicle Rental
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Rent cars and bikes in Nepal with ease. Browse our selection of vehicles and book your next ride
                  today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/vehicles?type=car">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Car className="mr-2 h-4 w-4" />
                    Browse Cars
                  </Button>
                </Link>
                <Link href="/vehicles?type=bike">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    <Bike className="mr-2 h-4 w-4" />
                    Browse Bikes
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0">
              <div className="aspect-video overflow-hidden rounded-xl">
                <img
                  alt="Hero Image"
                  className="object-cover w-full h-full"  
                  loading="lazy"
                  height="500"
                  src="/hamroSadhan.png"
                  width="550"
                />
              </div>
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
