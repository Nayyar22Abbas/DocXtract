import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
          
          const response = await fetch(`${apiBase}/authuser/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.email, // Backend expects username, we use email
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()

          if (data.access_token) {
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split('@')[0], // Use part before @ as name
              accessToken: data.access_token,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Store the access token and refresh token in the JWT on the initial login
      if (user && account) {
        if (account.provider === 'credentials') {
          // For credentials login, store FastAPI JWT token
          token.accessToken = (user as any).accessToken
        } else {
          // For OAuth providers, handle tokens from Google/GitHub
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
