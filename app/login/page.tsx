"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Car, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { signIn } = useAuth()

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  useEffect(() => {
    const confirmed = searchParams.get("confirmed")
    if (confirmed === "true") {
      toast({
        title: "Email Confirmed",
        description: "Your email has been successfully confirmed. You can now log in.",
        variant: "default",
      })
    }
    const error = searchParams.get("error")
    console.log("Login page error query param:", error)
    if (error) {
      let errorMessage = "Login failed"
      if (error === "CredentialsSignin") {
        errorMessage = "Invalid email or password"
      } else if (error === "SessionRequired") {
        errorMessage = "Please sign in to continue"
      }
      setErrorMessage(errorMessage)
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMessage(typeof error === "string" ? error : (error?.message || "Unknown error"))
        toast({
          title: "Login Error",
          description: typeof error === "string" ? error : (error?.message || "Unknown error"),
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      // signIn handles redirect based on role
    } catch (error: any) {
      const message = typeof error === "string" ? error : (error?.message || "Something went wrong")
      setErrorMessage(message)
      toast({
        title: "Login Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">HamroSadhan</span>
            </div>
            <CardTitle className="text-2xl font-bold">Log in to your account</CardTitle>
            <CardDescription>Enter your email and password to log in</CardDescription>
          </CardHeader>
          {errorMessage && (
            <div className="mb-4 rounded border border-red-600 bg-red-100 p-3 text-center text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-red-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
  )
}
