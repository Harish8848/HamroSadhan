
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/schemas/signup-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Car, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type SignupFormData = {
  fullName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    console.log("Signup form submitted with data:", data)
    setIsLoading(true)
    clearErrors()
    setSubmittedEmail(data.email)

    try {
      const { error } = await signUp(data.email, data.password, data.fullName, data.phone)
      console.log("signUp response error:", error)
      if (error) {
        if (error.message.toLowerCase().includes("email")) {
          setError("email", { message: error.message })
        } else {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: error.message || "Unknown error",
          })
        }
        setIsLoading(false)
        return
      }

      toast({
        variant: "default",
        title: "Signup successful",
        description: "Please check your email to confirm your account.",
      })

      setSignupSuccess(true)
    } catch (error: any) {
      console.error("Signup error caught:", error)
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      {!signupSuccess ? (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">HamroSadhan</span>
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  aria-describedby="fullName-error"
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-red-600 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="1234567890"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby="phone-error"
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby="confirmPassword-error"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="w-full max-w-md text-center p-8">
          <CardTitle className="text-2xl font-bold mb-4">Account Created</CardTitle>
          <CardDescription>
            Email sent to <strong>{submittedEmail}</strong>. Please verify your email by clicking the link sent to your email address.
          </CardDescription>
          <Button className="mt-6" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      )}
    </div>
  )
}


