# OAuth Setup Guide

This guide explains how to set up Google and GitHub OAuth for your DocXtract application.

## 1. Environment Variables

Update the `.env.local` file with your actual credentials:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here-replace-with-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

## 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local`

## 4. GitHub OAuth Setup

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: DocXtract
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

## 5. Database Integration

### Current Status
- **Credentials Login**: Currently uses mock data. You need to connect to your backend API.
- **OAuth Login**: Currently works but doesn't save to database. You need to implement database saving.

### To Connect to Database:

1. Update the `authorize` function in `app/api/auth/[...nextauth]/route.ts` (lines 22-56)
2. Update the `jwt` callback for OAuth users (lines 65-83)
3. Update the `signIn` callback for OAuth users (lines 93-102)
4. Update the `signup` function in `lib/api/auth.ts` (lines 54-106)

### Example Database Integration:

```typescript
// In app/api/auth/[...nextauth]/route.ts
async authorize(credentials) {
  const response = await fetch('http://your-backend-api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  })
  
  const user = await response.json()
  if (response.ok && user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
  return null
}
```

## 6. Testing

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Try logging in with:
   - Credentials: test@example.com / password (mock data)
   - Google OAuth (if configured)
   - GitHub OAuth (if configured)

## 7. Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URIs to Google and GitHub OAuth apps
3. Ensure your backend API is accessible from your frontend domain
4. Use secure environment variable management

## Important Notes

- OAuth users are NOT automatically saved to your database yet - you need to implement this
- Credentials login uses mock data - you need to connect to your real authentication API
- The signup form doesn't create accounts yet - you need to connect to your backend API
- All TODO comments in the code indicate where you need to add your backend integration
