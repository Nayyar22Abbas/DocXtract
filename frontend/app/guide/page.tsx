"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, FileText, Shield, Sparkles, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TextType from "@/components/TextType"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function GuidePage() {
  return (
    <div className="relative min-h-screen">
      <section className="relative pt-16 pb-20 px-4">
        <div className="container max-w-5xl mx-auto space-y-16">
          {/* Hero / Intro */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8 text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Welcome to DocXtract
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-balance text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                <TextType
                  text={["Your command center for intelligent document workflows"]}
                  typingSpeed={50}
                  pauseDuration={3000}
                  showCursor
                  cursorCharacter="_"
                  cursorBlinkDuration={0.5}
                  loop={false}
                  className="inline"
                />
              </h1>
              <p className="mx-auto max-w-3xl text-balance text-base md:text-lg text-muted-foreground">
                This guide walks you through how DocXtract thinks about documents, how to get the most accurate
                results, and where everything lives in your workspace.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="px-8 text-base">
                <Link href="/dashboard">
                  Go to dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                You can always come back to this guide from the Home tab in the navbar.
              </p>
            </motion.div>
          </motion.div>

          {/* How it works steps */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 bg-background/60">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">1. Bring your documents</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload PDFs, scanned images, or text files from your device or existing systems. We handle real-world
                    documents: multi-page reports, forms, invoices and more.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 bg-background/60">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Workflow className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">2. Extract what matters</h2>
                  <p className="text-sm text-muted-foreground">
                    Our AI pipeline reads your documents, understands their structure, and extracts clean, structured
                    data that&apos;s ready for analysis, search, or downstream systems.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 bg-background/60">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">3. Review and act</h2>
                  <p className="text-sm text-muted-foreground">
                    Explore processed results in your dashboard, export them to your tools, or plug them into your
                    workflows with confidence-grade explanations and full traceability.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Layout explanation */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                How your workspace is organised
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Think of DocXtract as a focused workspace for all of your documents. Each area in the app is designed to
                answer a specific question: <span className="font-medium text-foreground">Where are my files?</span>,
                <span className="font-medium text-foreground"> what did we extract?</span>, and
                <span className="font-medium text-foreground"> what should I do next?</span>
              </p>

              <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Home (this page)</span> – your starting point after
                  sign-in. Use it to understand capabilities, best practices, and quick links into the rest of the app.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Dashboard</span> – a high-level view of your recent
                  activity: processed documents, success and error rates, and shortcuts into what needs your attention.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Document Processing</span> – the hands-on workspace
                  where you upload new files, track processing status, inspect extracted fields, and re-run jobs.
                </li>
              </ul>
            </div>

            <Card className="border-border/50 bg-background/60">
              <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  Getting from zero to first result
                </h3>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Go to <span className="font-semibold text-foreground">Document Processing</span>.</li>
                  <li>Upload a document you already know well (e.g. an invoice or report).</li>
                  <li>Review the extracted fields and tweak any options you have configured.</li>
                  <li>Save the run, and you&apos;ll see it appear in your Dashboard overview.</li>
                </ol>
                <p>
                  Once you&apos;re comfortable with a single document, scale out by uploading batches and wiring DocXtract
                  into your existing tools.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
