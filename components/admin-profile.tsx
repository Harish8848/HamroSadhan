"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function AdminProfile() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [fullName, setFullName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  // Removed phone state as 'phone' does not exist on User type
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFullName(user?.name || "")
    setEmail(user?.email || "")
    // Removed setPhone as 'phone' does not exist on User type
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement update user API call or context update here
      toast({
        title: "Profile updated",
        description: "Your admin profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 w-[300px]">
      <h2 className="text-lg font-semibold">Admin Profile</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {/* Removed Phone input as 'phone' does not exist on User type */}
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
