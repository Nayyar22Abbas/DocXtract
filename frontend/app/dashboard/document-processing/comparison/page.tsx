'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDocuments } from '@/lib/providers/document-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BarChart3 } from 'lucide-react'

export default function ComparisonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documents } = useDocuments()
  
  const doc1Id = searchParams.get('doc1')
  const doc2Id = searchParams.get('doc2')
  const doc1 = documents.find(d => d.id === doc1Id)
  const doc2 = documents.find(d => d.id === doc2Id)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Document Comparison</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Compare two documents side by side
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

        {doc1 && doc2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Document 1
                  </CardTitle>
                  <CardDescription>{doc1.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc1.uploadDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Document 2
                  </CardTitle>
                  <CardDescription>{doc2.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc2.uploadDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-effect border-primary/20">
              <CardContent className="p-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📊 This is a frontend-only demo. Document comparison is not available without backend integration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
