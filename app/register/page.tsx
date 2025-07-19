"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import  { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/schemas/signup-schema"
import type { z } from "zod"

type SignupFormData = z.infer<typeof signupSchema> & { full_name: string }

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })


  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          phone: "", // optional, can be updated to include phone input value
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: result.error || "An error occurred during registration",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Registration successful",
        description: result.message || `✅ Email sent to ${data.email}. Please confirm your email.`,
        variant: "default",
      })

      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" {...register("full_name")} />
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" placeholder="+977 98XXXXXXXX" />
               </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
