
"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Car, Menu, User, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const isAdmin = user?.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold cursor-default select-none">HamroSadhan</span>
          </Link>
        </div>

          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Home
              </Link>
              <Link
                href="/locations"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/locations") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Locations
              </Link>
              <Link
                href="/vehicles"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/vehicles") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Vehicles
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/contact") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Contact
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/about") ? "text-primary" : "text-muted-foreground"
                )}
              >
                About
              </Link>
            </nav>
          )}

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.phone || "No phone"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {!isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

          {isMenuOpen && !isAdmin && (
            <div className="fixed inset-0 z-50 bg-background md:hidden">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                  <Car className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">HamroSadhan</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="container grid gap-6 py-6">
                <Link href="/" className="text-lg font-medium" onClick={closeMenu}>
                  Home
                </Link>
                <Link href="/locations" className="text-lg font-medium" onClick={closeMenu}>
                  Locations
                </Link>
                <Link href="/vehicles" className="text-lg font-medium" onClick={closeMenu}>
                  Vehicles
                </Link>
                <Link href="/contact" className="text-lg font-medium" onClick={closeMenu}>
                  Contact
                </Link>
                <Link href="/about" className="text-lg font-medium" onClick={closeMenu}>
                  About
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-lg font-medium" onClick={closeMenu}>
                      Dashboard
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="text-lg font-medium" onClick={closeMenu}>
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" className="text-lg font-medium" onClick={closeMenu}>
                      Profile
                    </Link>
                    <Link href="/bookings" className="text-lg font-medium" onClick={closeMenu}>
                      My Bookings
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start px-0"
                      onClick={() => {
                        signOut()
                        closeMenu()
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start px-0">
                      <Link href="/login" onClick={closeMenu}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register" onClick={closeMenu}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
    </header>
  )
}
