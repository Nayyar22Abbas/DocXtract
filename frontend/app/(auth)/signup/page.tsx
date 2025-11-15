"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FuturisticBackground } from "@/components/futuristic-background"
import { signup } from "@/lib/api/auth"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signup(data)
      if (result.success) {
        // Redirect to dashboard or handle success
        window.location.href = "/dashboard"
      } else {
        setError(result.message || "Signup failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestCredentials = () => {
    setError("")
    // Show the test credentials info
    setError("Use these test credentials to login:\n- Email: test@example.com\n- Password: password123\n\nOr email: demo@docxtract.com with password: demo123456")
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FuturisticBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Demo Account Information</CardTitle>
            <CardDescription>Frontend-only demonstration mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 text-sm bg-blue-500/10 border border-blue-500/20 rounded-md space-y-3"
            >
              <p className="font-semibold text-blue-700 dark:text-blue-400">🔧 Signup Disabled</p>
              <p className="text-sm">Signup is not available in this demo version. Please use one of the test credentials below to login:</p>
              <div className="space-y-2 mt-3 pt-3 border-t border-blue-500/20">
                <div>
                  <p className="text-xs font-mono bg-black/20 p-2 rounded">Email: test@example.com</p>
                  <p className="text-xs font-mono bg-black/20 p-2 rounded mt-1">Password: password123</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">— OR —</p>
                <div>
                  <p className="text-xs font-mono bg-black/20 p-2 rounded">Email: demo@docxtract.com</p>
                  <p className="text-xs font-mono bg-black/20 p-2 rounded mt-1">Password: demo123456</p>
                </div>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a frontend-only demo. To access the application, please log in with one of the test credentials shown above.
              </p>
              <Button className="w-full h-11" asChild>
                <Link href="/login">
                  <span>Go to Login</span>
                </Link>
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
