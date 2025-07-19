"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Bike, Shield, Clock, Users, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"



export default function AboutPage() {
const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-5 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Nepal's Trusted Rental Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">HamroSadhan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted companion for exploring the beautiful landscapes of Nepal. We provide reliable car and bike
              rentals to make your journey memorable and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl ">
          <div className="grid lg:grid-cols-2 gap-6 ">
            <div>
              <h2 className=" text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To revolutionize transportation in Nepal by providing accessible, reliable, and affordable vehicle
                rental services. We believe everyone should have the freedom to explore Nepal's stunning beauty at their
                own pace.By connecting travelers with local vehicle owners, we aim to foster economic growth and support sustainable tourism practices across the country. We prioritize the safety and reliability of our services, ensuring all vehicles are well-maintained and comprehensive support is always available. Furthermore, we are dedicated to promoting eco-friendly travel by expanding our fleet with sustainable options and encouraging responsible travel. We strive to build a seamless and connected transportation network that makes exploring every corner of Nepal easier for everyone, continuously seeking innovative solutions and prioritizing customer satisfaction to offer the best possible rental experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">100% Verified Vehicles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">24/7 Customer Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Transparent Pricing</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/HamroSadhan.png"
                alt="Nepal landscape with vehicles"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you need a car for a family trip or a bike for solo adventures, we have the perfect vehicle for
              your journey across Nepal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Car Rentals</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  From compact cars for city drives to SUVs for mountain adventures. All vehicles are well-maintained
                  and regularly serviced for your safety and comfort.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Sedans, SUVs, and Hatchbacks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    GPS Navigation Included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Full Insurance Coverage
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Bike className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Bike Rentals</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Perfect for exploring narrow mountain trails and city streets. Our bikes are ideal for both adventure
                  seekers and daily commuters.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Scooters and Motorcycles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Safety Gear Provided
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Fuel Efficient Options
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HamroSadhan?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best rental experience in Nepal with our customer-first approach and
              reliable service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe & Secure</h3>
              <p className="text-gray-600">
                All our vehicles undergo regular safety checks and maintenance. Your safety is our top priority.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support to assist you during your journey. We&apos;re always here to help.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Expertise</h3>
              <p className="text-gray-600">
                Born and raised in Nepal, we know the best routes and hidden gems to make your trip unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Nepal Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your perfect vehicle today and explore Nepal like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-black text-lg px-8 py-3  text-white border-white hover:bg-white hover:text-blue-600"  onClick={(e) => router.push("/vehicles?subject=Browse%20Vehicles")}>
              Browse Vehicles
            </Button>
            <Button
              size="lg"
              variant="outline"
              className=" bg-black text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              onClick={(e) => router.push("/contact?subject=Location%20Suggestion")}>
              
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  )
}