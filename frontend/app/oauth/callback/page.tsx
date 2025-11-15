'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { setAuthFromToken } from '@/lib/api/auth'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Missing token in callback URL')
      return
    }

    try {
      setAuthFromToken(token)
      router.replace('/dashboard')
    } catch {
      setError('Failed to process login. Please try again.')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <>
            <p className="text-destructive text-sm font-medium">{error}</p>
            <button
              className="text-sm text-primary underline"
              onClick={() => router.replace('/login')}
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  )
}