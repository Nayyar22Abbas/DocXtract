'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileText,
  BookOpen,
  MessageSquare,
  GitBranch,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type ProcessType =
  | 'summarize'
  | 'chapters'
  | 'citation'
  | 'qa'
  | 'concepts'
  | 'comparison'
  | 'insights'

interface ProcessCardsProps {
  selectedDocIds?: string[]
  onCardClick?: (type: ProcessType) => void
}

interface ProcessCard {
  id: ProcessType
  title: string
  description: string
  icon: React.ReactNode
  color: string
  path: string
  requiresMultipleDocs: boolean
}

const PROCESS_CARDS: ProcessCard[] = [
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Generate a concise summary of your document',
    icon: <FileText className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
    path: '/dashboard/document-processing/summarize',
    requiresMultipleDocs: false,
  },
  {
    id: 'chapters',
    title: 'Chapter-wise Summary',
    description: 'View AI-generated summaries for each chapter',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-teal-500 to-teal-600',
    path: '/dashboard/document-processing/chapters',
    requiresMultipleDocs: false,
  },
  {
    id: 'citation',
    title: 'Citation Analysis',
    description: 'Analyze citations and references in your document',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
    path: '/dashboard/document-processing/citation',
    requiresMultipleDocs: false,
  },
  {
    id: 'qa',
    title: 'Q&A Chatbot',
    description: 'Ask questions about your document content',
    icon: <MessageSquare className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    path: '/dashboard/document-processing/qa',
    requiresMultipleDocs: false,
  },
  {
    id: 'concepts',
    title: 'Concept Graphs',
    description: 'Visualize key concepts and relationships',
    icon: <GitBranch className="h-8 w-8" />,
    color: 'from-orange-500 to-orange-600',
    path: '/dashboard/document-processing/concepts',
    requiresMultipleDocs: false,
  },
  {
    id: 'comparison',
    title: 'Document Comparison',
    description: 'Compare two documents side by side',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'from-pink-500 to-pink-600',
    path: '/dashboard/document-processing/comparison',
    requiresMultipleDocs: true,
  },
  {
    id: 'insights',
    title: 'Predictive Insight',
    description: 'Get AI-powered insights and predictions',
    icon: <Lightbulb className="h-8 w-8" />,
    color: 'from-yellow-500 to-yellow-600',
    path: '/dashboard/document-processing/insights',
    requiresMultipleDocs: false,
  },
]

export function ProcessCards({ selectedDocIds = [], onCardClick }: ProcessCardsProps) {
  const router = useRouter()

  const handleCardClick = (card: ProcessCard) => {
    // Check if card requires multiple docs
    if (card.requiresMultipleDocs && selectedDocIds.length < 2) {
      alert('Please select 2 documents for comparison')
      return
    }

    // If card requires single doc but none selected
    if (!card.requiresMultipleDocs && selectedDocIds.length === 0) {
      alert('Please select a document first')
      return
    }

    onCardClick?.(card.id)

    // Navigate with document IDs as query params
    const params = new URLSearchParams()
    selectedDocIds.forEach((id, index) => {
      params.append(`doc${index + 1}`, id)
    })
    router.push(`${card.path}?${params.toString()}`)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Processes</h2>
        <p className="text-muted-foreground">
          Select a process to analyze your document
          {selectedDocIds.length > 0 && ` (${selectedDocIds.length} selected)`}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {PROCESS_CARDS.map((card) => {
          const isDisabled =
            (card.requiresMultipleDocs && selectedDocIds.length < 2) ||
            (!card.requiresMultipleDocs && selectedDocIds.length === 0)

          return (
            <motion.div key={card.id} variants={fadeInUp}>
              <Card
                className={`glass-effect border-primary/20 h-full cursor-pointer transition-all duration-300 hover:border-primary/40 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed hover:border-primary/20' : ''
                }`}
                onClick={() => !isDisabled && handleCardClick(card)}
              >
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${card.color} w-fit`}>
                    <div className="text-white">{card.icon}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    <CardDescription className="mt-2">{card.description}</CardDescription>
                  </div>

                  {card.requiresMultipleDocs && (
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      ⚠️ Requires 2 documents
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                    {isDisabled ? 'Select document to start' : 'Start process'}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
