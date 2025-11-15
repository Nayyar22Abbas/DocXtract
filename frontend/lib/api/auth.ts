import { signIn, signOut } from 'next-auth/react'

// Dummy credentials for testing - FRONTEND ONLY
const DUMMY_CREDENTIALS = [
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  {
    email: 'demo@docxtract.com',
    password: 'demo123456',
    name: 'Demo Account'
  }
]

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

// Validate against dummy credentials
function validateDummyCredentials(email: string, password: string): { valid: boolean; user?: any } {
  const user = DUMMY_CREDENTIALS.find(cred => cred.email === email && cred.password === password)
  return {
    valid: !!user,
    user
  }
}

// Login with dummy credentials using NextAuth
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Validate against dummy credentials first
    const validation = validateDummyCredentials(credentials.email, credentials.password)
    
    if (!validation.valid) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Proceed with NextAuth sign-in
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        message: 'Login failed',
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

// Signup function - DISABLED - no backend integration
export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  return {
    success: false,
    message: 'Signup is not available. Please use a test account to login.',
  }
}

// Logout function
export async function logout(): Promise<void> {
  await signOut({ redirect: false })
}
