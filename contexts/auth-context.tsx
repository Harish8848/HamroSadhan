"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"
import { useRouter } from "next/navigation"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, getSession } from "next-auth/react"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // On app load, restore session using next-auth
    getSession().then((session) => {
      if (session && session.user) {
        // Normalize role string
        if (session.user.role && typeof session.user.role === "string") {
          session.user.role = session.user.role.trim().toLowerCase()
        }
        setUser(session.user as User)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      })

      if (!result || result.error) {
        return { error: result?.error || "Login failed" }
      }

      // Get session after signIn
      const session = await getSession()
      if (session && session.user) {
        // Normalize role string
        if (session.user.role && typeof session.user.role === "string") {
          session.user.role = session.user.role.trim().toLowerCase()
        }
        setUser(session.user as User)

        // Redirect based on role
        const role = session.user.role || ""
        if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      email = email.trim().toLowerCase()
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { error: data.error || "Signup failed" }
      }
      localStorage.setItem("authToken", data.token)
      setUser(data.user)

      // Redirect based on role
      if (data.user && data.user.role) {
        const role = data.user.role.trim().toLowerCase()
        if (role === "user") {
          router.push("/dashboard")
        } else if (role === "admin") {
          router.push("/admin")
        } else {
          alert("Email not verified yet")
        }
      }

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signOut = async () => {
    await nextAuthSignOut()
    setUser(null)
    router.push("/")
  }

  const resetPassword = async (email: string) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { error: data.error || "Reset password failed" }
      }
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
