"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return <div className="container py-8">Please log in to view your profile.</div>
  }

  return (
    <div className="container py-8 max-w-md">
      <UserProfile user={user} />
    </div>
  )
}
