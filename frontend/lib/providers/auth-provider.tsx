'use client'

import { createContext, useContext } from 'react'
import { SessionProvider, useSession, signOut } from 'next-auth/react'

interface AuthContextType {
  isAuthenticated: boolean
  username?: string
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === 'authenticated'
  const username = session?.user?.name || session?.user?.email
  
  const logout = async () => {
    await signOut({ redirect: false })
  }

  const value = {
    isAuthenticated,
    username,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
