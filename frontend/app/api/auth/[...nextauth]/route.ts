import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Replace this with actual backend API call
        // This should validate credentials against your database
        if (credentials?.email && credentials?.password) {
          // Example API call to your backend:
          // const response = await fetch('http://your-backend-api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     email: credentials.email,
          //     password: credentials.password
          //   })
          // })
          // 
          // const user = await response.json()
          // if (response.ok && user) {
          //   return {
          //     id: user.id,
          //     email: user.email,
          //     name: user.name,
          //   }
          // }
          // return null

          // Temporary mock - REPLACE WITH ACTUAL API CALL
          if (credentials.email === "test@example.com" && credentials.password === "password") {
            return {
              id: '1',
              email: credentials.email,
              name: 'Test User',
            }
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      
      // Handle OAuth sign-ins (Google/GitHub)
      if (account?.provider === 'google' || account?.provider === 'github') {
        // TODO: Save OAuth user to your database here
        // Example:
        // const response = await fetch('http://your-backend-api/auth/oauth', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     provider: account.provider,
        //     providerId: user.id,
        //     email: user.email,
        //     name: user.name,
        //     image: user.image
        //   })
        // })
        // 
        // const dbUser = await response.json()
        // token.id = dbUser.id // Use database user ID
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // This runs on every sign-in attempt
      // For OAuth providers, you can save user data to database here
      if (account?.provider === 'google' || account?.provider === 'github') {
        // TODO: Check if user exists in database, if not create them
        console.log('OAuth sign-in:', { provider: account.provider, user })
        return true // Allow sign-in
      }
      return true
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
