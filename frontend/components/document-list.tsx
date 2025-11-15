'use client'

import { motion } from 'framer-motion'
import { FileText, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StoredDocument } from '@/lib/providers/document-provider'
import { useState } from 'react'

interface DocumentListProps {
  documents: StoredDocument[]
  selectedDocIds: string[]
  onSelectDocument: (id: string) => void
  onDeleteDocument: (id: string) => void
  maxSelections?: number
}

export function DocumentList({
  documents,
  selectedDocIds,
  onSelectDocument,
  onDeleteDocument,
  maxSelections = 2,
}: DocumentListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    return <FileText className="h-8 w-8" />
  }

  const isSelected = (id: string) => selectedDocIds.includes(id)
  const canSelect = (id: string) =>
    isSelected(id) || selectedDocIds.length < maxSelections

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  }

  if (documents.length === 0) {
    return (
      <Card className="glass-effect border-primary/20 border-dashed">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-muted-foreground">Upload your first document to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Documents</h2>
        <p className="text-muted-foreground">
          {documents.length} document{documents.length === 1 ? '' : 's'} ({selectedDocIds.length} selected)
        </p>
      </div>

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <motion.div key={doc.id} variants={fadeInUp} initial="initial" animate="animate">
            <Card
              className={`glass-effect border-primary/20 transition-all duration-300 cursor-pointer ${
                isSelected(doc.id)
                  ? 'border-primary/60 bg-primary/5'
                  : 'hover:border-primary/40'
              } ${!canSelect(doc.id) && !isSelected(doc.id) ? 'opacity-50' : ''}`}
              onClick={() => canSelect(doc.id) && onSelectDocument(doc.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox/Selection indicator */}
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected(doc.id)
                        ? 'bg-primary border-primary'
                        : 'border-primary/30 hover:border-primary/60'
                    }`}
                  >
                    {isSelected(doc.id) && <Check className="h-4 w-4 text-white" />}
                  </div>

                  {/* File icon */}
                  <div className="flex-shrink-0 text-primary">
                    {getFileIcon(doc.type)}
                  </div>

                  {/* Document info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(doc.size)} • {formatDate(doc.uploadDate)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <div className="flex-shrink-0">
                    {deleteConfirm === doc.id ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteDocument(doc.id)
                            setDeleteConfirm(null)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(doc.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
