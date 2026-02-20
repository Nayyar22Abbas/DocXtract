'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2, Copy, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateFlashcardsWithCitation, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'

interface Flashcard {
  question: string
  answer: string
  citation?: string
  difficulty?: string
}

export default function FlashcardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()
  const abortControllerRef = useRef<AbortController | null>(null)

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Always abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!doc1 || flashcards.length > 0 || isGenerating) return
    void handleGenerateFlashcards()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [doc1])

  const handleGenerateFlashcards = async () => {
    if (!doc1) return

    abortControllerRef.current = new AbortController()

    const userId = getUsername()
    if (!userId) {
      setError('You must be logged in to generate flashcards.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const pdfBlob = await downloadPdf(doc1.id)
      const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })

      const result = await generateFlashcardsWithCitation(file, 10, abortControllerRef.current.signal)
      setFlashcards(result.flashcards || result)
      setCurrentCard(0)
      setIsFlipped(false)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (flashcards.length === 0) return
    const card = flashcards[currentCard]
    const text = `Q: ${card.question}\nA: ${card.answer}${card.citation ? `\nCitation: ${card.citation}` : ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Generate Flashcards</h1>
            <p className="text-muted-foreground text-lg mt-2">
              AI-generated flashcards with citations from your document
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
                No document selected for flashcard generation.
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

            {/* Flashcards Display */}
            {flashcards.length > 0 && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Flashcards</CardTitle>
                      <CardDescription>
                        Card {currentCard + 1} of {flashcards.length}
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
                <CardContent className="space-y-6">
                  {/* Flashcard */}
                  <motion.div
                    onClick={() => setIsFlipped(!isFlipped)}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-primary/20 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer relative"
                  >
                    <div className="text-center space-y-4" style={{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }}>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {isFlipped ? 'Answer' : 'Question'}
                      </p>
                      <p className="text-2xl font-bold leading-relaxed">
                        {isFlipped ? flashcards[currentCard].answer : flashcards[currentCard].question}
                      </p>
                      {isFlipped && flashcards[currentCard].citation && (
                        <p className="text-xs text-muted-foreground pt-4 border-t border-primary/20 mt-4">
                          📌 {flashcards[currentCard].citation}
                        </p>
                      )}
                    </div>
                    <p className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                      Click to flip
                    </p>
                  </motion.div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={prevCard}
                      variant="outline"
                      size="sm"
                      disabled={flashcards.length <= 1}
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={nextCard}
                      variant="outline"
                      size="sm"
                      disabled={flashcards.length <= 1}
                      className="flex-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-primary h-2 rounded-full"
                    />
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
                    onClick={handleGenerateFlashcards}
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
                      <p className="font-medium">Generating flashcards...</p>
                      <p className="text-xs text-muted-foreground">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            {flashcards.length === 0 && !isGenerating && (
              <Button
                onClick={handleGenerateFlashcards}
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
                  'Generate Flashcards'
                )}
              </Button>
            )}

            {/* Regenerate Button */}
            {flashcards.length > 0 && (
              <Button
                onClick={handleGenerateFlashcards}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Generate New Flashcards
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
