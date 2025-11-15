'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDocuments } from '@/lib/providers/document-provider'
import { DocumentList } from '@/components/document-list'
import { ProcessCards } from '@/components/process-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, ArrowLeft } from 'lucide-react'

export default function DocumentProcessingPage() {
  const router = useRouter()
  const { documents, deleteDocument, isLoading } = useDocuments()
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSelectDocument = (id: string) => {
    setSelectedDocIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id)
    setSelectedDocIds((prev) => prev.filter((docId) => docId !== id))
  }

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Document Processing</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Select documents and choose a process to analyze
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.length > 0 ? (
                  <DocumentList
                    documents={documents}
                    selectedDocIds={selectedDocIds}
                    onSelectDocument={handleSelectDocument}
                    onDeleteDocument={handleDeleteDocument}
                    maxSelections={2}
                  />
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No documents uploaded yet
                    </p>
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="outline"
                      className="w-full"
                    >
                      Upload Document
                    </Button>
                  </div>
                )}

                {documents.length > 0 && (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload More
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Process Cards Section */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {selectedDocIds.length > 0 ? (
                <ProcessCards selectedDocIds={selectedDocIds} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a document to see available processes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
