"use client"

import { useEffect } from "react"
import { router, usePage } from '@inertiajs/react';
import { useAuth } from "@/lib/auth-context"

export default function KidsPage() {
  
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!user?.permissions.accessKids && user?.role !== 'admin') {
      router.push("/")
      return
    }

    // Always redirect to kids dashboard
    router.push("/kids/dashboard")
  }, [isAuthenticated, user, router, isLoading])

  // Return null - global PageLoader handles loading screen
  return null
}
