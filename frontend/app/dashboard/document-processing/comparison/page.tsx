'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BarChart3, Loader2, Copy } from 'lucide-react'
import { comparePdfs, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'
import ReactMarkdown from 'react-markdown'

export default function ComparisonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()

  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparison, setComparison] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const doc1Id = searchParams.get('doc1')
  const doc2Id = searchParams.get('doc2')
  const doc1 = documents.find(d => d.id === doc1Id)
  const doc2 = documents.find(d => d.id === doc2Id)

  const handleCompare = async () => {
    if (!doc1 || !doc2) return

    setError(null)
    setComparison('')
    setIsComparing(true)

    try {
      const userId = getUsername()
      if (!userId) {
        setError('You must be logged in to compare documents.')
        setIsComparing(false)
        return
      }

      // Download both PDFs
      const blob1 = await downloadPdf(doc1.id)
      const blob2 = await downloadPdf(doc2.id)

      const file1 = new File([blob1], doc1.name || 'document1.pdf', { type: 'application/pdf' })
      const file2 = new File([blob2], doc2.name || 'document2.pdf', { type: 'application/pdf' })

      // Compare documents
      const result = await comparePdfs(file1, file2, userId)
      setComparison(result.comparison_summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare documents')
    } finally {
      setIsComparing(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(comparison)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Compare Documents</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Analyze differences and similarities between two PDFs
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

        {doc1 && doc2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Document 1
                  </CardTitle>
                  <CardDescription className="truncate">{doc1.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc1.uploadDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Document 2
                  </CardTitle>
                  <CardDescription className="truncate">{doc2.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc2.uploadDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Button & Results */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>Comparison Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!comparison && !isComparing && (
                  <Button
                    onClick={handleCompare}
                    disabled={isComparing}
                    size="lg"
                    className="w-full"
                  >
                    {isComparing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Comparing...
                      </>
                    ) : (
                      'Start Comparison'
                    )}
                  </Button>
                )}

                {isComparing && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <div className="space-y-2">
                      <p className="font-medium">Analyzing documents...</p>
                      <p className="text-xs text-muted-foreground">
                        This may take a moment
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-sm text-destructive">
                    {error}
                    {error && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleCompare}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                )}

                {comparison && (
                  <div className="space-y-3">
                    <div className="flex justify-end">
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
                    <div className="prose prose-invert max-w-none max-h-[500px] overflow-y-auto p-4 bg-muted/50 rounded-lg">
                      <ReactMarkdown
                        components={{
                          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-sm" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                        }}
                      >
                        {comparison}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {(!doc1 || !doc2) && (
          <Card className="glass-effect border-primary/20">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Please select 2 documents to compare
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
