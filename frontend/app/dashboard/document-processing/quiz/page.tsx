'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Loader2, Copy, CheckCircle2, XCircle } from 'lucide-react'
import { generateQuizModel, getQuizSolution, downloadPdf } from '@/lib/api/endpoints'
import { getUsername } from '@/lib/api/auth'

interface MCQ {
  question: string
  options: string[]
  difficulty: string
}

interface ShortAnswer {
  question: string
  difficulty: string
}

interface TrueFalse {
  statement: string
}

interface QuizData {
  quiz_id: string
  document_type: string
  questions: {
    mcqs: MCQ[]
    short_answer: ShortAnswer[]
    true_false: TrueFalse[]
  }
}

interface Solution {
  quiz_id: string
  solutions: {
    mcqs: any[]
    short_answer: any[]
    true_false: any[]
  }
}

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingSolution, setIsLoadingSolution] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!doc1 || quiz || isGenerating) return
    void handleGenerateQuiz()
  }, [doc1])

  const handleGenerateQuiz = async () => {
    if (!doc1) return

    const userId = getUsername()
    if (!userId) {
      setError('You must be logged in')
      return
    }

    setIsGenerating(true)
    setError(null)
    setQuiz(null)
    setSolution(null)
    setShowSolution(false)

    try {
      const pdfBlob = await downloadPdf(doc1.id)
      const file = new File([pdfBlob], doc1.name || 'document.pdf', { type: 'application/pdf' })

      const result = await generateQuizModel(file, 'Research Paper', userId)
      setQuiz(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShowSolution = async () => {
    if (!quiz) return

    setIsLoadingSolution(true)
    setError(null)

    try {
      const result = await getQuizSolution(quiz.quiz_id)
      setSolution(result)
      setShowSolution(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solution')
    } finally {
      setIsLoadingSolution(false)
    }
  }

  const handleCopyQuiz = () => {
    if (!quiz) return
    const text = formatQuizAsText(quiz)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatQuizAsText = (quizData: QuizData): string => {
    let text = `Quiz: ${quizData.document_type}\n\n`

    if (quizData.questions.mcqs.length > 0) {
      text += `MCQs:\n`
      quizData.questions.mcqs.forEach((q, i) => {
        text += `\n${i + 1}. ${q.question} (${q.difficulty})\n`
        q.options.forEach((opt, j) => {
          text += `   ${String.fromCharCode(65 + j)}) ${opt}\n`
        })
      })
    }

    if (quizData.questions.short_answer.length > 0) {
      text += `\n\nShort Answer Questions:\n`
      quizData.questions.short_answer.forEach((q, i) => {
        text += `\n${i + 1}. ${q.question} (${q.difficulty})\n`
      })
    }

    if (quizData.questions.true_false.length > 0) {
      text += `\n\nTrue/False Questions:\n`
      quizData.questions.true_false.forEach((q, i) => {
        text += `\n${i + 1}. ${q.statement}\n`
      })
    }

    return text
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Quiz Generator</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Generate and solve quizzes from your documents
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

            {/* Loading State */}
            {isGenerating && (
              <Card className="glass-effect border-primary/20">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <div>
                      <p className="font-medium">Generating quiz...</p>
                      <p className="text-xs text-muted-foreground">
                        This may take a moment
                      </p>
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
                    onClick={handleGenerateQuiz}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quiz Display */}
            {quiz && (
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Generated Quiz</CardTitle>
                      <CardDescription>
                        Total Questions: {quiz.questions.mcqs.length + quiz.questions.short_answer.length + quiz.questions.true_false.length}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyQuiz}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* MCQs */}
                  {quiz.questions.mcqs.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
                      {quiz.questions.mcqs.map((mcq, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 space-y-2"
                        >
                          <p className="font-medium text-sm">
                            {idx + 1}. {mcq.question}
                            <span className="ml-2 text-xs text-muted-foreground">({mcq.difficulty})</span>
                          </p>
                          {mcq.options.map((option, optIdx) => (
                            <p key={optIdx} className="text-sm text-muted-foreground ml-4">
                              {String.fromCharCode(65 + optIdx)}) {option}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Short Answer */}
                  {quiz.questions.short_answer.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Short Answer Questions</h3>
                      {quiz.questions.short_answer.map((sa, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 space-y-2"
                        >
                          <p className="font-medium text-sm">
                            {idx + 1}. {sa.question}
                            <span className="ml-2 text-xs text-muted-foreground">({sa.difficulty})</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {quiz.questions.true_false.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">True/False Questions</h3>
                      {quiz.questions.true_false.map((tf, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 space-y-2"
                        >
                          <p className="font-medium text-sm">
                            {idx + 1}. {tf.statement}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Solution Button */}
                  <div className="pt-4 border-t border-primary/10">
                    <Button
                      onClick={handleShowSolution}
                      disabled={isLoadingSolution}
                      className="w-full"
                    >
                      {isLoadingSolution ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading Solution...
                        </>
                      ) : (
                        'View Solution'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Solution Display */}
            {showSolution && solution && (
              <Card className="glass-effect border-primary/20 bg-green-500/5 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Quiz Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* MCQ Solutions */}
                  {solution.solutions.mcqs.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">MCQ Answers</h3>
                      {solution.solutions.mcqs.map((mcq, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/30 space-y-2 border border-green-500/20"
                        >
                          <p className="font-medium text-sm">{idx + 1}. {mcq.question}</p>
                          <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                            ✓ Correct Answer: {mcq.correct_answer}
                          </p>
                          {mcq.explanation && (
                            <p className="text-xs text-muted-foreground mt-2">
                              <strong>Explanation:</strong> {mcq.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Short Answer Solutions */}
                  {solution.solutions.short_answer.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Short Answer Solutions</h3>
                      {solution.solutions.short_answer.map((sa, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/30 space-y-2 border border-green-500/20"
                        >
                          <p className="font-medium text-sm">{idx + 1}. {sa.question}</p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {sa.expected_answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False Solutions */}
                  {solution.solutions.true_false.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">True/False Answers</h3>
                      {solution.solutions.true_false.map((tf, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/30 space-y-2 border border-green-500/20"
                        >
                          <p className="font-medium text-sm">{idx + 1}. {tf.statement}</p>
                          <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                            {tf.answer ? '✓ True' : '✗ False'}
                          </p>
                          {tf.explanation && (
                            <p className="text-xs text-muted-foreground mt-2">
                              <strong>Explanation:</strong> {tf.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
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
