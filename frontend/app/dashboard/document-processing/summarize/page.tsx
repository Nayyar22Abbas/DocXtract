'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { API_BASE, authHeaders, getUsername } from '@/lib/api/auth'

export default function SummarizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents, getSummary } = useDocuments()
  
  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)
  const cachedSummary = doc1 ? getSummary(doc1.id) : undefined

  const [displaySummary, setDisplaySummary] = useState<string | undefined>(cachedSummary)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplaySummary(cachedSummary)
  }, [cachedSummary])

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
      // 1) Download original PDF from backend
      const downloadRes = await fetch(`${API_BASE}/pdfdownload/download-pdf/${doc1.id}`, {
        method: 'GET',
        headers: {
          ...authHeaders(),
        },
      })

      if (!downloadRes.ok) {
        const err = await downloadRes.json().catch(() => ({}))
        setError(err.detail || 'Failed to download document from server.')
        return
      }

      const blob = await downloadRes.blob()
      const fileName = doc1.name || 'document.pdf'
      const file = new File([blob], fileName, { type: blob.type || 'application/pdf' })

      // 2) Call summarize endpoint again with this file
      const formData = new FormData()
      formData.append('file', file)

      const summarizeRes = await fetch(
        `${API_BASE}/summary/summarize-pdf/?user_id=${encodeURIComponent(userId)}`,
        {
          method: 'POST',
          headers: {
            ...authHeaders(),
          },
          body: formData,
        }
      )

      const data = await summarizeRes.json().catch(() => ({}))

      if (!summarizeRes.ok) {
        setError(data.detail || 'Failed to generate summary from server.')
        return
      }

      const newSummary: string | undefined = data.summary
      if (!newSummary) {
        setError('No summary returned from server.')
        return
      }

      setDisplaySummary(newSummary)
    } catch {
      setError('An error occurred while generating the summary.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    // Auto-generate summary for documents that don't have a cached summary yet
    if (!doc1) return
    if (cachedSummary) return
    if (displaySummary) return
    if (isGenerating) return

    // Fire and forget; errors will be reflected in local state
    void handleGenerateSummary()
  }, [doc1, cachedSummary, displaySummary, isGenerating])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Document Summarization</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Generate an AI summary of your document to quickly understand the key points.
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
                Go back to Document Processing and choose a document to summarize.
              </p>
            </CardContent>
          </Card>
        )}

        {doc1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <CardContent className="space-y-4">
                {displaySummary && (
                  <div className="p-4 bg-muted/50 rounded-lg max-h-[400px] overflow-y-auto">
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {displaySummary}
                    </p>
                  </div>
                )}

                {!displaySummary && !isGenerating && !error && (
                  <p className="text-xs text-muted-foreground">
                    We&apos;re ready when you are. Click &quot;Generate summary&quot; below to summarize this document.
                  </p>
                )}

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-xs text-destructive">
                    {error}
                  </div>
                )}

                {isGenerating && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Generating summary... this can take a moment for longer PDFs.</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button onClick={handleGenerateSummary} disabled={isGenerating} size="sm">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      'Generate summary'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
