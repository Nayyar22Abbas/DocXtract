'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { generateConceptGraph, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'
import ConceptGraphVisualizer from '@/components/ConceptGraphVisualizer'

interface Node {
  id: string
  label: string
  type: 'topic' | 'entity'
}

interface Link {
  source: string
  target: string
  relation: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

export default function ConceptGraphPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()
  const abortControllerRef = useRef<AbortController | null>(null)

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Always abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!doc1 || graphData || isGenerating) return
    void handleGenerateGraph()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [doc1])

  const handleGenerateGraph = async () => {
    if (!doc1) return

    abortControllerRef.current = new AbortController()

    const userId = getUsername()
    if (!userId) {
      setError('You must be logged in to generate concept graphs.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const pdfBlob = await downloadPdf(doc1.id)
      const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })

      const result = await generateConceptGraph(file, true, 10, abortControllerRef.current.signal)
      setGraphData(result.graph)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to generate concept graph')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Concept Graph</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Visualize key concepts and their relationships
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
                No document selected for concept graph generation.
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

            {/* Graph Display */}
            {graphData && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle>Concept Network</CardTitle>
                  <CardDescription>
                    {graphData.nodes.length} concepts, {graphData.links.length} relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConceptGraphVisualizer data={graphData} loading={false} />
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && !isGenerating && (
              <Card className="glass-effect border-destructive/20 bg-destructive/5">
                <CardContent className="py-4">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button
                    onClick={handleGenerateGraph}
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
                      <p className="font-medium">Analyzing concepts...</p>
                      <p className="text-xs text-muted-foreground">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            {!graphData && !isGenerating && (
              <Button
                onClick={handleGenerateGraph}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Concept Graph'
                )}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
