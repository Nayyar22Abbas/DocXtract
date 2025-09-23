"use client"

import { motion } from "framer-motion"
import { FileText, Upload, BarChart3, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FuturisticBackground } from "@/components/futuristic-background"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative">
      <FuturisticBackground />

      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold">Welcome to DocXtract Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Start processing your documents with AI-powered intelligence
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>Drag and drop your documents or click to browse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center space-y-4 hover:border-primary/40 transition-colors">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload your first document</h3>
                    <p className="text-muted-foreground">Support for PDF, PNG, JPG, and more formats</p>
                  </div>
                  <Button size="lg" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-effect border-primary/20 h-full">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Quick steps to process your documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload your document</p>
                    <p className="text-xs text-muted-foreground">Choose files from your device</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">AI Processing</p>
                    <p className="text-xs text-muted-foreground">Let our AI extract the data</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Download Results</p>
                    <p className="text-xs text-muted-foreground">Get structured data output</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    No documents yet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Empty States */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeInUp}>
            <Card className="glass-effect border-primary/20 text-center">
              <CardContent className="p-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Documents</h3>
                <p className="text-2xl font-bold text-muted-foreground mb-1">0</p>
                <p className="text-xs text-muted-foreground">No documents uploaded yet</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="glass-effect border-primary/20 text-center">
              <CardContent className="p-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Processing</h3>
                <p className="text-2xl font-bold text-muted-foreground mb-1">0</p>
                <p className="text-xs text-muted-foreground">No active processing</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="glass-effect border-primary/20 text-center">
              <CardContent className="p-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-2xl font-bold text-muted-foreground mb-1">-</p>
                <p className="text-xs text-muted-foreground">Start uploading to see stats</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
