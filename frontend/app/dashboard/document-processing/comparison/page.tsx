'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { API_BASE, authHeaders, getUsername } from '@/lib/api/auth'

export default function ComparisonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents, getFileForDoc } = useDocuments()

  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonSummary, setComparisonSummary] = useState<string | null>(null)

  const doc1Id = searchParams.get('doc1')
  const doc2Id = searchParams.get('doc2')
  const doc1 = documents.find(d => d.id === doc1Id)
  const doc2 = documents.find(d => d.id === doc2Id)

  const handleCompare = async () => {
    if (!doc1 || !doc2) return

    setError(null)
    setComparisonSummary(null)
    setIsComparing(true)

    try {
      // Try to get files from in-memory cache first
      let file1 = getFileForDoc(doc1.id)
      let file2 = getFileForDoc(doc2.id)

      const username = getUsername() || 'ahsan'
      if (!username) {
        setError('You must be logged in to compare documents.')
        setIsComparing(false)
        return
      }

      // If either file is missing in this session, download it from the backend
      const downloadIfNeeded = async (docId: string, fallbackName: string) => {
        const res = await fetch(`${API_BASE}/pdfdownload/download-pdf/${encodeURIComponent(docId)}`, {
          method: 'GET',
          headers: {
            ...authHeaders(),
          },
        })

        if (!res.ok) {
          throw new Error('Failed to download document from server.')
        }

        const blob = await res.blob()
        return new File([blob], fallbackName || 'document.pdf', { type: 'application/pdf' })
      }

      try {
        if (!file1) {
          file1 = await downloadIfNeeded(doc1.id, doc1.name)
        }
        if (!file2) {
          file2 = await downloadIfNeeded(doc2.id, doc2.name)
        }
      } catch (downloadError: any) {
        setError(downloadError.message || 'Failed to download one of the documents from server.')
        setIsComparing(false)
        return
      }

      const formData = new FormData()
      formData.append('file1', file1)
      formData.append('file2', file2)

      const url = `${API_BASE}/ppdfcomparison/compare-pdfs/?user_id=${encodeURIComponent(username)}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...authHeaders(),
        },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const message = data?.detail || 'Failed to compare documents. Please try again.'
        throw new Error(message)
      }

      const data = await response.json()
      setComparisonSummary(data.comparison_summary || 'No comparison summary returned.')
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during comparison.')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Document Comparison</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Compare two documents side by side using AI-powered analysis
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
                  <CardDescription>{doc1.name}</CardDescription>
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
                  <CardDescription>{doc2.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc2.uploadDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-effect border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Ready to compare these documents?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll analyze both files and highlight the most important similarities and differences.
                    </p>
                  </div>
                  <Button onClick={handleCompare} disabled={isComparing}>
                    {isComparing ? 'Comparing…' : 'Compare documents'}
                  </Button>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {comparisonSummary && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 max-h-[400px] overflow-auto whitespace-pre-wrap text-sm leading-relaxed">
                    {comparisonSummary}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
