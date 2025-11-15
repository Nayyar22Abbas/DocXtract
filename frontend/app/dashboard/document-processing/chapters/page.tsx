'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { API_BASE, authHeaders, getUsername } from '@/lib/api/auth'

interface ChapterSummaries {
  [chapterTitle: string]: string
}

export default function ChaptersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents, getFileForDoc } = useDocuments()

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find((d) => d.id === doc1Id)

  const [summaries, setSummaries] = useState<ChapterSummaries | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!doc1Id || !doc1) return

      const file = getFileForDoc(doc1Id)
      if (!file) {
        setError(
          'Chapter-wise summary is only available for documents uploaded in this session. Please upload the document again from the dashboard.'
        )
        return
      }

      const userId = getUsername()
      if (!userId) {
        setError('You must be logged in to generate chapter-wise summaries.')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)
        // NOTE: Backend defines user_id as a non-form parameter, so we send it in the query string

        const res = await fetch(`${API_BASE}/chaptersum/summarize-pdf-chapters/?user_id=${encodeURIComponent(userId)}`, {
          method: 'POST',
          headers: {
            ...authHeaders(),
          },
          body: formData,
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setError(data.detail || 'Failed to generate chapter-wise summaries.')
          return
        }

        const chapterSummaries = data.chapter_summaries as ChapterSummaries | undefined
        if (!chapterSummaries) {
          setError('No chapter summaries returned from server.')
          return
        }

        setSummaries(chapterSummaries)
      } catch (err) {
        setError('An error occurred while generating chapter-wise summaries.')
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [doc1Id, doc1, getFileForDoc])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Chapter-wise Summary</h1>
            <p className="text-muted-foreground text-lg mt-2">
              View AI-generated summaries for each chapter
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

        {doc1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {doc1.name}
                </CardTitle>
                <CardDescription>
                  Uploaded on {new Date(doc1.uploadDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">Generating chapter summaries...</p>
                )}

                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/40 text-xs text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}

                {!isLoading && !error && summaries && (
                  <div className="space-y-4 max-h-[480px] overflow-y-auto">
                    {Object.entries(summaries).map(([title, text]) => (
                      <div key={title} className="border rounded-lg p-3 bg-muted/40">
                        <h3 className="text-sm font-semibold mb-1">{title}</h3>
                        <p className="text-xs text-muted-foreground whitespace-pre-line">{text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && !error && !summaries && (
                  <p className="text-sm text-muted-foreground">
                    No chapter summaries available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}