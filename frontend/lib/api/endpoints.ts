/**
 * API Endpoints and utilities for all document processing features
 */

import { API_BASE, authHeaders, getUsername } from './auth'

// ============================================================================
// 1. SUMMARIZE PDF (Combined - Summary + Chapter-wise)
// ============================================================================
export async function summarizePdfCombined(file: File, userId?: string, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', file)
  if (userId) formData.append('user_id', userId)

  const response = await fetch(`${API_BASE}/summary/summarize-pdf-combined/`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to generate summary')
  }

  return response.json()
}

// Response structure:
// {
//   "file_info": {
//     "filename": string,
//     "saved_path": string
//   },
//   "combined_summary": string, // Full markdown text with # Summary and ## Chapter-wise sections
//   "structured_data": {
//     "general_summary": string,
//     "chapters": {
//       "[chapter_title]": string, // Summary for each chapter
//       ...
//     }
//   }
// }

// ============================================================================
// 2. COMPARE PDFS
// ============================================================================
export async function comparePdfs(file1: File, file2: File, userId?: string, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file1', file1)
  formData.append('file2', file2)
  if (userId) formData.append('user_id', userId)

  const response = await fetch(`${API_BASE}/ppdfcomparison/compare-pdfs/`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to compare PDFs')
  }

  return response.json()
}

// Response structure:
// {
//   "files_info": [
//     {
//       "filename": string,
//       "saved_path": string
//     },
//     {
//       "filename": string,
//       "saved_path": string
//     }
//   ],
//   "comparison_summary": string // Markdown formatted comparison
// }

// ============================================================================
// 3. LITERATURE REVIEW (Multiple PDFs)
// ============================================================================
export async function generateLiteratureReview(files: File[], userId?: string, signal?: AbortSignal) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  if (userId) formData.append('user_id', userId)

  const response = await fetch(`${API_BASE}/lit-review/generate-lit-review/`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to generate literature review')
  }

  return response.json()
}

// Response structure:
// {
//   "files_processed": [
//     {
//       "filename": string,
//       "saved_path": string
//     },
//     ...
//   ],
//   "literature_review": string // Markdown with Thematic Analysis, Synthesis, Research Gaps, Future Work
// }

// ============================================================================
// 4. QUIZ GENERATION (Using Mistral Model)
// ============================================================================
export async function generateQuizModel(file: File, documentType?: string, userId?: string, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', file)
  if (documentType) formData.append('document_type', documentType)
  if (userId) formData.append('user_id', userId)

  const response = await fetch(`${API_BASE}/v2/quiz/generate-model`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to generate quiz')
  }

  return response.json()
}

// Response structure:
// {
//   "quiz_id": string, // MongoDB ObjectId as string
//   "document_type": string,
//   "questions": {
//     "mcqs": [
//       {
//         "question": string,
//         "options": string[],
//         "difficulty": "Easy" | "Medium" | "Hard"
//       },
//       ...
//     ],
//     "short_answer": [
//       {
//         "question": string,
//         "difficulty": "Easy" | "Medium" | "Hard"
//       },
//       ...
//     ],
//     "true_false": [
//       {
//         "statement": string
//       },
//       ...
//     ]
//   }
// }

// ============================================================================
// 5. GET QUIZ SOLUTION
// ============================================================================
export async function getQuizSolution(quizId: string, signal?: AbortSignal) {
  const response = await fetch(`${API_BASE}/v2/quiz/solution/${quizId}`, {
    method: 'GET',
    headers: authHeaders(),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to fetch quiz solution')
  }

  return response.json()
}

// Response structure:
// {
//   "quiz_id": string,
//   "solutions": {
//     "mcqs": [
//       {
//         "question": string,
//         "options": string[],
//         "correct_answer": string,
//         "difficulty": string,
//         "explanation": string
//       },
//       ...
//     ],
//     "short_answer": [
//       {
//         "question": string,
//         "expected_answer": string,
//         "difficulty": string
//       },
//       ...
//     ],
//     "true_false": [
//       {
//         "statement": string,
//         "answer": boolean,
//         "explanation": string
//       },
//       ...
//     ]
//   }
// }

// ============================================================================
// 6. PDF CHAT
// ============================================================================
export async function chatWithPdf(pdfId: string, question: string, signal?: AbortSignal) {
  const response = await fetch(`${API_BASE}/pdfchat/chat-pdf/${pdfId}`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: question,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to get answer')
  }

  return response.json()
}

// Response structure:
// {
//   "answer": string // AI-generated answer based on PDF content
// }

// ============================================================================
// 7. MCQ GENERATION
// ============================================================================
export async function generateMcqs(file: File, totalMcqs: number, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('total_mcqs', totalMcqs.toString())

  const response = await fetch(`${API_BASE}/mcqgeneration/generate-mcqs/`, {
    method: 'POST',
    headers: {
      // Only include Authorization, let FormData handle Content-Type
      ...authHeaders(),
    },
    body: formData,
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to generate MCQs')
  }

  return response.json()
}

// Response structure:
// {
//   "filename": string,
//   "requested_mcqs_per_chunk": number,
//   "total_chunks": number,
//   "mcqs": [
//     {
//       "question": string,
//       "options": string[],
//       "correct_answer": string | number
//     } | string, // Could be raw text if JSON parsing fails
//     ...
//   ]
// }

// ============================================================================
// 8. PDF MANAGEMENT
// ============================================================================

export async function downloadPdf(pdfId: string, signal?: AbortSignal) {
  const response = await fetch(`${API_BASE}/pdfdownload/download-pdf/${pdfId}`, {
    method: 'GET',
    headers: authHeaders(),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to download PDF')
  }

  return response.blob()
}

export async function listPdfs(userId: string) {
  const response = await fetch(`${API_BASE}/list/list-pdfs/${userId}`, {
    method: 'GET',
    headers: authHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to fetch PDFs')
  }

  return response.json()
}

// Response structure:
// {
//   "documents": [
//     {
//       "id": string,
//       "original_name": string,
//       "saved_path": string,
//       "upload_time": string (ISO datetime)
//     },
//     ...
//   ]
// }

export async function deletePdf(pdfId: string) {
  const response = await fetch(`${API_BASE}/deletepdf/pdf/${pdfId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to delete PDF')
  }

  return response.json()
}

// Response structure:
// {
//   "message": "PDF deleted successfully",
//   "pdf_id": string
// }
