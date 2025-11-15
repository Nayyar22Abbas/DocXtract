'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface StoredDocument {
  id: string
  name: string
  uploadDate: string
  size: number
  type: 'pdf' | 'doc' | 'docx'
}

interface DocumentContextType {
  documents: StoredDocument[]
  addDocument: (file: File) => boolean
  deleteDocument: (id: string) => void
  getDocumentCount: () => number
  isLoading: boolean
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

const STORAGE_KEY = 'docxtract_documents'
const MAX_DOCUMENTS = 5

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setDocuments(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load documents from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever documents change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
    }
  }, [documents, isLoading])

  const addDocument = (file: File): boolean => {
    if (documents.length >= MAX_DOCUMENTS) {
      return false
    }

    const fileType = file.name.endsWith('.pdf')
      ? 'pdf'
      : file.name.endsWith('.docx')
        ? 'docx'
        : 'doc'

    const newDocument: StoredDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      uploadDate: new Date().toISOString(),
      size: file.size,
      type: fileType,
    }

    setDocuments((prev) => [newDocument, ...prev])
    return true
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDocumentCount = () => documents.length

  const value = {
    documents,
    addDocument,
    deleteDocument,
    getDocumentCount,
    isLoading,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}

export function useDocuments(): DocumentContextType {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}
