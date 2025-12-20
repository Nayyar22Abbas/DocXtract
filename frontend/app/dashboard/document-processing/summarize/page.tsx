'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2, Copy, Download } from 'lucide-react'
import { summarizePdfCombined, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'
import ReactMarkdown from 'react-markdown'

export default function SummarizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [summary, setSummary] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerateSummary = async () => {
    if (!doc1) return

    const userId = getUsername()
    if (!userId) {
      setError('You must be logged in to generate a summary.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Download PDF blob from backend
      const pdfBlob = await downloadPdf(doc1.id)
      const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })

      // Call combined summary endpoint
      const result = await summarizePdfCombined(file, userId)
      setSummary(result.combined_summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Auto-generate summary on load if no summary yet
    if (!doc1 || summary || isGenerating) return
    void handleGenerateSummary()
  }, [doc1])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Summarize Document</h1>
            <p className="text-muted-foreground text-lg mt-2">
              AI-generated summary with chapter-wise breakdown
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

        {!doc1 && (
          <Card className="glass-effect border-primary/20">
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                No document selected for summarization.
              </p>
              <p className="text-xs text-muted-foreground">
                Go back and select a document first.
              </p>
            </CardContent>
          </Card>
        )}

        {doc1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Document Info Card */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {doc1.name}
                </CardTitle>
                <CardDescription>
                  Uploaded on {new Date(doc1.uploadDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Summary Display Card */}
            {summary && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Summary & Chapter Analysis</CardTitle>
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
                      {summary}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && !isGenerating && (
              <Card className="glass-effect border-destructive/20 bg-destructive/5">
                <CardContent className="py-4">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button
                    onClick={handleGenerateSummary}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isGenerating && (
              <Card className="glass-effect border-primary/20">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <div className="space-y-2">
                      <p className="font-medium">Generating summary...</p>
                      <p className="text-xs text-muted-foreground">
                        This may take a few moments for longer documents
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            {!summary && !isGenerating && (
              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
