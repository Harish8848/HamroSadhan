"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/types"

interface UserProfileProps {
  user: User & { fullName?: string; phone?: string | null }
}

export function UserProfile({ user }: UserProfileProps) {
  const [full_name, setFullName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || "")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const profileUpdatePayload: { userId: string; full_name?: string; phone?: string } = {
        userId: user.id,
        full_name: full_name ?? undefined,
        phone,
      }

      const profileResponse = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileUpdatePayload),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      // Handle password change if fields are filled
      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          throw new Error("All password fields must be filled to change password.")
        }
        if (newPassword !== confirmPassword) {
          throw new Error("New password and confirm password do not match.")
        }

        const passwordChangeResponse = await fetch("/api/users/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            oldPassword,
            newPassword,
          }),
        })

        if (!passwordChangeResponse.ok) {
          const errorData = await passwordChangeResponse.json()
          throw new Error(errorData.error || "Failed to change password")
        }

        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
        })

        // Clear password fields
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpdateProfile}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email ?? ""} disabled />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" value={full_name ?? ""} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
