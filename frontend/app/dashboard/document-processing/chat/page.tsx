'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Send, FileText, Loader2 } from 'lucide-react'
import { chatWithPdf } from '@/lib/api/endpoints'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()

  const doc1Id = searchParams.get('doc1')
  const doc1 = documents.find(d => d.id === doc1Id)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can answer questions about the document you selected. What would you like to know?',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !doc1 || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const result = await chatWithPdf(doc1.id, inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get answer'
      setError(errorMsg)
      setMessages(prev =>
        prev.slice(0, -1).concat({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I encountered an error: ${errorMsg}. Please try again.`,
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full space-y-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Chat with PDF</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Ask questions about your document
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
            className="flex flex-col gap-4 flex-1"
          >
            {/* Document Info */}
            <Card className="glass-effect border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4" />
                  {doc1.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Uploaded: {new Date(doc1.uploadDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Chat Area */}
            <Card className="glass-effect border-primary/20 flex-1 flex flex-col">
              <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-primary/10 p-4 space-y-2">
                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                    {error}
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question about the document..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground border border-primary/20 focus:outline-none focus:border-primary/50 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="sm"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
