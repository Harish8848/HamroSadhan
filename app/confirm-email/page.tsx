"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setError("Missing token")
      setLoading(false)
      return
    }

    async function confirmEmail() {
      try {
        const response = await fetch(`/api/auth/confirm-email?token=${token}`)
        const data = await response.json()
        if (!response.ok) {
          setError(data.error || "Failed to confirm email")
          setLoading(false)
          return
        }
        toast({
          title: "Email confirmed successfully",
          description: "Redirecting to login page...",
        })
        setLoading(false)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } catch (err) {
        setError("An unexpected error occurred")
        setLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router, toast])

  if (loading) {
    return <div className="container py-8 text-center">Confirming your email...</div>
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-600">
        <p>Error: {error}</p>
        <Button onClick={() => router.push("/signup")}>Back to Signup</Button>
      </div>
    )
  }

  return <div className="container py-8 text-center">Email confirmed! Redirecting to login...</div>
}
