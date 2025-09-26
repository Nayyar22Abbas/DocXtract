import { signIn, signOut } from 'next-auth/react'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

// Login with credentials using NextAuth
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    return {
      success: true,
      message: 'Login successful',
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during login',
    }
  }
}

// Signup function - calls FastAPI backend
export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    
    // Call FastAPI signup endpoint
    const response = await fetch(`${apiBase}/authuser/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.email, // Backend expects username, we use email
        password: credentials.password
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // After successful signup, automatically sign them in
      const signInResult = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })
      
      return {
        success: !signInResult?.error,
        message: signInResult?.error ? 'Signup successful but login failed' : 'Account created and logged in successfully',
        user: {
          id: 'temp-id',
          name: credentials.name,
          email: credentials.email
        }
      }
    }
    
    return {
      success: false,
      message: data.detail || 'Signup failed'
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      message: 'An error occurred during signup',
    }
  }
}

// Google OAuth login
export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: '/dashboard',
    })

    if (result?.error) {
      return {
        success: false,
        message: 'Google login failed',
      }
    }

    return {
      success: true,
      message: 'Google login successful',
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during Google login',
    }
  }
}

// GitHub OAuth login
export async function loginWithGitHub(): Promise<AuthResponse> {
  try {
    const result = await signIn('github', {
      redirect: false,
      callbackUrl: '/dashboard',
    })

    if (result?.error) {
      return {
        success: false,
        message: 'GitHub login failed',
      }
    }

    return {
      success: true,
      message: 'GitHub login successful',
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during GitHub login',
    }
  }
}

// Logout function
export async function logout(): Promise<void> {
  await signOut({ redirect: false })
}
