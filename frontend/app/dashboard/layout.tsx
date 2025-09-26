'use client'

import type React from "react"
import { useAuth } from '@/lib/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Let the redirect happen
  }

  return <div className="min-h-screen bg-background">{children}</div>
}
