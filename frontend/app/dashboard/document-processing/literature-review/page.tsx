'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Copy } from 'lucide-react'
import { generateLiteratureReview, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'
import ReactMarkdown from 'react-markdown'

export default function LiteratureReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()
  const abortControllerRef = useRef<AbortController | null>(null)

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [literatureReview, setLiteratureReview] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Always abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleGenerateReview = async () => {
    // Use only the selected document
    const allFiles: File[] = []
    
    // Add the selected document from document-processing
    if (doc1) {
      try {
        const pdfBlob = await downloadPdf(doc1.id)
        const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })
        allFiles.push(file)
      } catch (err) {
        setError('Failed to load selected document. Please try again.')
        return
      }
    }

    if (allFiles.length === 0) {
      setError('No document selected. Please go back and select a document.')
      return
    }

    const userId = getUsername()
    if (!userId) {
      setError('You must be logged in')
      return
    }

    abortControllerRef.current = new AbortController()
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateLiteratureReview(allFiles, userId, abortControllerRef.current.signal)
      
      // Check if the result contains an error message from the backend
      if (result.literature_review && result.literature_review.includes('⚠️')) {
        // It's a warning/error message from the backend
        setLiteratureReview(result.literature_review)
        setError(null)
      } else if (result.literature_review) {
        setLiteratureReview(result.literature_review)
        setError(null)
      } else {
        setError('No literature review was generated. Please try again.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate literature review'
      setError(errorMsg)
      console.error('Literature review error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(literatureReview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Literature Review Generator</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Synthesize multiple research papers into a comprehensive review
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Selected Base Document */}
          {doc1 && (
            <Card className="glass-effect border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Selected Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-primary/20">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {doc1.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This document will be included in the literature review analysis
                </p>
              </CardContent>
            </Card>
          )}

          {/* File Upload */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Generate Review</CardTitle>
              <CardDescription>
                Analyze the selected document to generate a literature review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateReview}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Review...
                  </>
                ) : (
                  'Generate Literature Review'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isGenerating && (
            <Card className="glass-effect border-primary/20">
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div className="space-y-2">
                    <p className="font-medium">Generating literature review...</p>
                    <p className="text-xs text-muted-foreground">
                      Analyzing and synthesizing research papers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Literature Review Display */}
          {literatureReview && (
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Literature Review Synthesis</CardTitle>
            <CardDescription>
                      Based on the selected document
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none max-h-[600px] overflow-y-auto p-4 bg-muted/50 rounded-lg">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-sm" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                    }}
                  >
                    {literatureReview}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Review Button */}
          {literatureReview && (
            <Button
              onClick={() => {
                setLiteratureReview('')
                setError(null)
              }}
              variant="outline"
              className="w-full"
            >
              Generate Another Review
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
