'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2, Copy, Edit2 } from 'lucide-react'
import { generateMcqs, downloadPdf } from '@/lib/api/endpoints'

interface MCQ {
  question: string
  options: string[]
  correct_answer: string | number
}

export default function McqPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()
  const abortControllerRef = useRef<AbortController | null>(null)

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [mcqs, setMcqs] = useState<MCQ[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string | number }>({})
  const [showAnswers, setShowAnswers] = useState(false)
  
  // Fixed to 10 MCQs for resource optimization
  const NUM_MCQS = 10

  // Always abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleGenerateMcqs = async () => {
    if (!doc1) return

    abortControllerRef.current = new AbortController()

    setIsGenerating(true)
    setError(null)
    setMcqs([])
    setSelectedAnswers({})
    setShowAnswers(false)

    try {
      const pdfBlob = await downloadPdf(doc1.id)
      const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })

      // Create a timeout promise (10 minutes for MCQ generation with local model)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10 minutes. The model is taking too long. Try with fewer MCQs (3-5).')), 600000)
      )

      const result = await Promise.race([
        generateMcqs(file, NUM_MCQS, abortControllerRef.current.signal),
        timeoutPromise
      ])
      
      console.log('MCQ Response:', result) // Debug log
      
      // Handle both array and object responses
      let mcqsList = Array.isArray(result) ? result : (result?.mcqs || [])
      
      if (!Array.isArray(mcqsList)) {
        console.error('Invalid MCQ format:', mcqsList)
        setError('Invalid response format from server')
        return
      }
      
      if (mcqsList.length === 0) {
        setError('No MCQs generated. The model may have failed to generate valid questions. Try with fewer MCQs (5-10).')
        return
      }
      
      // Filter valid MCQs
      const validMcqs = mcqsList.filter(
        (mcq: any) =>
          typeof mcq === 'object' &&
          mcq.question &&
          typeof mcq.question === 'string' &&
          mcq.options &&
          Array.isArray(mcq.options) &&
          mcq.options.length >= 2 &&
          (mcq.correct_answer !== undefined && mcq.correct_answer !== null)
      ) as MCQ[]
      
      console.log('Filtered MCQs:', validMcqs) // Debug log
      
      if (validMcqs.length === 0) {
        setError('No valid MCQs found in response. The model may need adjustment. Try with fewer MCQs (5-10).')
        return
      }
      
      setMcqs(validMcqs)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      console.error('MCQ Generation Error:', err) // Debug log
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate MCQs'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyMcqs = () => {
    const text = mcqs
      .map(
        (mcq, idx) =>
          `${idx + 1}. ${mcq.question}\n${mcq.options.map((opt, i) => `   ${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}`
      )
      .join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectAnswer = (questionIdx: number, answerIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIdx]: answerIdx,
    }))
  }

  const calculateScore = () => {
    let correct = 0
    mcqs.forEach((mcq, idx) => {
      if (selectedAnswers[idx] === mcq.correct_answer || selectedAnswers[idx] === mcq.options[mcq.correct_answer as number]) {
        correct++
      }
    })
    return { correct, total: mcqs.length, percentage: Math.round((correct / mcqs.length) * 100) }
  }

  const score = showAnswers ? calculateScore() : null

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">MCQ Generator</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Create and practice multiple choice questions
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
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Please select a document first
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
            {/* Document Info */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {doc1.name}
                </CardTitle>
                <CardDescription>
                  Uploaded: {new Date(doc1.uploadDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* MCQ Settings - Removed, now fixed to 10 MCQs */}
            {mcqs.length === 0 && !isGenerating && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle>Generate MCQs</CardTitle>
                  <CardDescription>
                    Generate {NUM_MCQS} practice questions from your document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleGenerateMcqs}
                    disabled={isGenerating || !doc1}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    Generate {NUM_MCQS} MCQs
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Optimized for resource efficiency - generates 10 questions
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isGenerating && (
              <Card className="glass-effect border-primary/20">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div className="text-left">
                        <p className="font-semibold text-lg">Generating MCQs...</p>
                        <p className="text-sm text-muted-foreground">
                          Please wait, this may take 2-5 minutes
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 space-y-2 max-w-md mx-auto">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">📄</span>
                        <span className="text-muted-foreground">Processing {NUM_MCQS} questions...</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">🤖</span>
                        <span className="text-muted-foreground">AI model analyzing your document...</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                        <span>💡</span>
                        <span>Tip: Fewer questions (3-5) generate faster. You can try again with fewer if this takes too long.</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="glass-effect border-destructive/20 bg-destructive/5">
                <CardContent className="py-4">
                  <p className="text-sm text-destructive mb-3">{error}</p>
                  <Button
                    onClick={handleGenerateMcqs}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* MCQs Display - Only show when mcqs are loaded and no error */}
            {mcqs.length > 0 && !error && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Generated MCQs</CardTitle>
                      <CardDescription>
                        Total: {mcqs.length} questions
                        {showAnswers && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            Score: {score?.correct}/{score?.total} ({score?.percentage}%)
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyMcqs}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMcqs([])
                          setShowAnswers(false)
                          setSelectedAnswers({})
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mcqs.map((mcq, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg bg-muted/50 space-y-3 border border-primary/10"
                    >
                      <p className="font-medium">
                        {idx + 1}. {mcq.question}
                      </p>
                      <div className="space-y-2">
                        {mcq.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                              selectedAnswers[idx] === optIdx
                                ? 'bg-primary/20 border border-primary/50'
                                : 'hover:bg-muted'
                            } ${
                              showAnswers &&
                              (optIdx === mcq.correct_answer ||
                                option === mcq.correct_answer)
                                ? 'bg-green-500/20 border border-green-500/50'
                                : showAnswers &&
                                    selectedAnswers[idx] === optIdx &&
                                    optIdx !== mcq.correct_answer
                                ? 'bg-red-500/20 border border-red-500/50'
                                : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              checked={selectedAnswers[idx] === optIdx}
                              onChange={() => handleSelectAnswer(idx, optIdx)}
                              disabled={showAnswers}
                              className="cursor-pointer"
                            />
                            <span className="text-sm">{option}</span>
                            {showAnswers &&
                              optIdx === mcq.correct_answer && (
                                <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
                                  ✓ Correct
                                </span>
                              )}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Submit Button */}
                  {!showAnswers && Object.keys(selectedAnswers).length === mcqs.length && (
                    <Button
                      onClick={() => setShowAnswers(true)}
                      className="w-full"
                    >
                      Submit Answers
                    </Button>
                  )}

                  {showAnswers && (
                    <Button
                      onClick={() => {
                        setShowAnswers(false)
                        setSelectedAnswers({})
                      }}
                      className="w-full"
                    >
                      Reset Answers
                    </Button>
                  )}

                  {showAnswers && (
                    <Button
                      onClick={() => {
                        setMcqs([])
                        setShowAnswers(false)
                        setSelectedAnswers({})
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Generate New MCQs
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
