"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const { isAuthenticated, username, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center -my-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="relative h-24 w-24 mt-10 overflow-visible rounded-lg">
              <Image src="/logo2.png" alt="DocXtract Logo" width={96} height={96} className="object-contain" />
            </div>
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-base font-bold transition-colors ${
            pathname === '/' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-foreground/70 hover:text-foreground'
          }`}>
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={`text-base font-bold transition-colors ${
                  pathname === '/dashboard' || pathname.startsWith('/dashboard') && !pathname.includes('document-processing')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/document-processing"
                className={`text-base font-bold transition-colors ${
                  pathname.includes('/dashboard/document-processing')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Document Processing
              </Link>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <span className="text-base font-bold text-foreground/70">Hello, {username}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
