# 📄 DOCxTRACT - Intelligent Document Processing Platform

> Transform your documents into actionable insights with AI-powered analysis, semantic search, and intelligent retrieval.

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116%2B-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-Latest-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-FF6B6B?style=flat)](https://faiss.ai)

</div>

---

## 🎯 Overview

**DOCxTRACT** is a full-stack intelligent document processing platform that leverages advanced AI, semantic search, and retrieval-augmented generation (RAG) to extract, analyze, and synthesize knowledge from documents. It combines the power of Google's Gemini 2.5 Flash API with local LLMs and state-of-the-art vector retrieval to provide lightning-fast, accurate document intelligence.

### ⚡ Key Highlights

- 🤖 **Hybrid AI Engine**: Gemini 2.5 Flash + Mistral 7B local model
- 🔍 **FAISS-Powered RAG**: Fast semantic search with vector embeddings
- 📊 **Multi-Model Processing**: Support for PDF, text, and graph-based documents
- 💬 **Conversational AI**: Chat naturally with your documents
- 🎓 **Educational Features**: Quiz and MCQ generation with explanations
- 📈 **Advanced Analytics**: Concept graphs and relationship extraction
- 🔐 **Secure**: JWT authentication and MongoDB integration
- 🚀 **Cloud-Ready**: Docker containerized, CI/CD integrated

---

## 🎨 Features

### 1. 📝 Document Summarization
**Powered by:** Gemini 2.5 Flash API  
Automatically generate concise, accurate summaries of large documents. Supports both extractive and abstractive summarization for enhanced comprehension.

```
Input: 50-page PDF report
Output: Key insights, main points, executive summary
```

---

### 2. 💬 Chat with Documents
**Powered by:** Gemini 2.5 Flash API  
Ask natural language questions about your documents and receive contextual, accurate responses grounded in the document content through RAG.

```
User: "What are the main findings?"
AI: "Based on the document, the main findings are..."
```

---

### 3. 🔄 Document Comparison
**Powered by:** Gemini 2.5 Flash API  
Compare multiple documents side-by-side to identify differences, similarities, and complementary information.

```
Input: Document A, Document B
Output: Detailed comparison matrix with insights
```

---

### 4. 🧠 Concept Graph Visualization
**Powered by:** Gemini 2.5 Flash / Local Mistral  
Extract key concepts and their relationships from documents and visualize them as interactive force-directed graphs.

```
Entities: AI, Machine Learning, Neural Networks
Relations: encompasses, enables, related_to
```

---

### 5. 📚 Quiz Generation
**Powered by:** Mistral 7B (Local Model)  
Auto-generate contextual quizzes from document content with multiple-choice or short-answer questions.

```
Features:
- Adjustable difficulty levels
- Question type variety
- Solution explanations
```

---

### 6. ❓ Multiple Choice Questions (MCQs)
**Powered by:** Mistral 7B (Local Model)  
Generate engaging MCQs with distractors for assessment and learning purposes.

```
Range: 5-50 questions per document
Formats: Single/Multiple correct answers
```

---

### 7. 📖 Literature Review Generation
**Powered by:** Gemini 2.5 Flash API  
Synthesize insights across multiple research documents to create coherent literature reviews with proper citations.

```
Input: Multiple research papers
Output: Synthesized review with themes and findings
```

---

### 8. 🔖 Smart Flashcards
**Powered by:** Gemini 2.5 Flash + Local Models  
Generate flashcards with source citations for spaced repetition learning.

```
Features:
- Auto-generated Q&A pairs
- Source text attribution
- Difficulty classification
```

---

### 9. 🧩 RDF Triplet Storage & Retrieval
**Powered by:** Gemini API + Semantic Search  
Store document knowledge as RDF triples (Subject-Predicate-Object) with intelligent indexing for fast retrieval and knowledge graph construction.

```
Example Triple:
Subject: Machine Learning
Predicate: is_a
Object: AI Subfield
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard  │  Chat  │  Quiz  │  MCQ  │  Summary   │   │
│  │  Concepts   │ Graphs │ Literature Review │ Auth    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS / WebSocket
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (FastAPI)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /v1/* (Gemini API)  │  /v2/* (Model-based)        │   │
│  │  /summary  /chat  /quiz  /mcq  /flashcard           │   │
│  │  /concept-graph  /triplets  /lit-review             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  Gemini API     │  │  Local Models    │  │  Vector DB      │
│  (Cloud)        │  │  (Mistral 7B)    │  │  (FAISS)        │
└─────────────────┘  └──────────────────┘  └─────────────────┘
    │                      │                      │
    └──────────────┬───────┴──────────────────────┘
                   ▼
    ┌──────────────────────────────────────┐
    │  Processing Pipeline                 │
    │  ┌────────────────────────────────┐  │
    │  │ PDF Extraction  │ Text Chunking│  │
    │  │ Embeddings  │ Triplet Storage │  │
    │  │ Semantic Search │ RAG Pipeline │  │
    │  └────────────────────────────────┘  │
    └──────────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌─────────────────┐        ┌──────────────┐
│   MongoDB       │        │  File Storage│
│  (Metadata)     │        │  (PDFs/Data) │
└─────────────────┘        └──────────────┘
```

---

## 🔬 Technical Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | FastAPI | 0.116+ |
| **Python** | Python | 3.10+ |
| **Database** | MongoDB | 4.15.0+ |
| **LLM API** | Google Gemini 2.5 Flash | Latest |
| **Local LLM** | Mistral 7B | GGUF Format |
| **Vector Search** | FAISS (Facebook AI Similarity Search) | 1.13.1+ |
| **PDF Processing** | pdfplumber, PyMuPDF | Latest |
| **NLP** | scikit-learn, networkx | Latest |
| **Embeddings** | Google Generative AI | 0.8.5+ |
| **Authentication** | JWT + Authlib | 1.6.4+ |
| **Server** | Uvicorn | Latest |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | Latest |
| **Language** | TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **Components** | Radix UI | 1.x |
| **Animations** | Framer Motion | Latest |
| **Graph Viz** | React Force Graph | Latest |
| **State Mgmt** | React Hooks | Built-in |
| **HTTP Client** | Axios / Fetch API | Latest |
| **Markdown** | react-markdown | 9.0.1+ |

### DevOps & Deployment
| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Vercel** | Frontend hosting (CI/CD) |
| **Cloud Run / App Engine** | Backend deployment options |

---

## 🚀 RAG & FAISS Implementation

### What is RAG (Retrieval-Augmented Generation)?

RAG is a technique that grounds LLM responses in retrieved documents, reducing hallucinations and ensuring factually accurate answers.

```
Query
  ↓
[Vector Embedding] 
  ↓
FAISS Search (Find similar docs)
  ↓
Retrieve Top-K Chunks
  ↓
Prompt + Context
  ↓
LLM (Gemini)
  ↓
Grounded Answer
```

### FAISS Integration

**FAISS (Facebook AI Similarity Search)** enables blazingly-fast vector similarity search:

```python
# Dense Vector Storage
embedding_index.add(document_embeddings)

# Query Time (Near-instantaneous)
distances, indices = embedding_index.search(query_vector, k=5)
```

**Key Benefits:**
- ⚡ **Sub-millisecond retrieval** for millions of vectors
- 💾 **Memory-efficient** with GPU acceleration support
- 📊 **Scalable** architecture for enterprise use
- 🎯 **Accurate** semantic matching

### Text Chunking Strategy

```python
"""
Large Document → Chunked into 512-token segments
           ↓
    [Overlap: 50 tokens]
           ↓
    Embedded individually
           ↓
    Stored in FAISS
```

**Adaptive Chunking:**
- Respects sentence boundaries (no mid-sentence breaks)
- Maintains context overlap for coherence
- Optimized chunk size: 512 tokens (adjustable)

### Retrieval Pipeline

```
User Query: "What are the main recommendations?"
            ↓
         Embed Query
            ↓
    Search FAISS Index
            ↓
    Retrieve Top-5 Chunks
            ↓
    "Recommendations include:
     1. Implement robust monitoring
     2. Scale infrastructure..."
            ↓
     Pass to Gemini with Context
            ↓
   "Based on the document, the main
    recommendations are..."
```

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance
- Docker & Docker Compose (optional)
- Google API Key (for Gemini API)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements_safe.txt

# 4. Configure environment variables
cat > .env << EOF
GOOGLE_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017
SESSION_SECRET=your_secret_key
EOF

# 5. Run backend server
python index.py
```

**Server runs on:** `http://localhost:8000`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# 4. Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

### Docker Deployment

```bash
# Build and run entire stack
docker-compose up --build

# Backend: localhost:8000
# Frontend: localhost:3000
```

---

## 🔌 API Endpoints

### Core Endpoints

#### 1. Document Summarization
```http
POST /summary/summarize-pdf-combined/
Content-Type: multipart/form-data

{
  "file": <PDF_FILE>,
  "summarization_type": "abstractive"  // or "extractive"
}

Response:
{
  "summary": "Key insights and main points...",
  "key_points": ["Point 1", "Point 2"],
  "model": "Gemini 2.5 Flash"
}
```

#### 2. Chat with PDF
```http
POST /pdfchat/chat-pdf/{pdf_id}
Content-Type: application/json

{
  "question": "What are the main findings?",
  "conversation_history": [...]
}

Response:
{
  "answer": "Based on the document...",
  "source_chunks": ["Relevant excerpt..."],
  "confidence": 0.95
}
```

#### 3. Quiz Generation
```http
POST /v2/quiz/generate-model/
Content-Type: multipart/form-data

{
  "file": <PDF_FILE>,
  "num_questions": 10,
  "difficulty": "medium"
}

Response:
{
  "quiz": [
    {
      "question": "Q1...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "Explanation..."
    }
  ]
}
```

#### 4. MCQ Generation
```http
POST /mcqgeneration/generate-mcqs/
Content-Type: multipart/form-data

{
  "file": <PDF_FILE>,
  "num_questions": 20
}

Response:
{
  "mcqs": [...],
  "total_questions": 20,
  "difficulty_distribution": {...}
}
```

#### 5. Concept Graphs
```http
POST /insight/v2/concept-graph/
Content-Type: multipart/form-data

{
  "file": <PDF_FILE>,
  "use_api": true,
  "max_concepts": 10
}

Response:
{
  "graph": {
    "nodes": [{"id": "AI", "label": "Artificial Intelligence"}],
    "links": [{"source": "AI", "target": "ML", "relation": "encompasses"}]
  }
}
```

#### 6. RDF Triplet Storage
```http
POST /insight/v2/triplets/save/
Content-Type: application/json

{
  "pdf_name": "document.pdf",
  "doc_id": "unique-id",
  "metadata": {"topic": "AI"}
}

Response:
{
  "status": "success",
  "triple_count": 45,
  "storage_path": "triplet_storage/unique-id_triples.json"
}
```

---

## 📊 Project Structure

```
DOCxTRACT/
├── backend/
│   ├── index.py                 # Main FastAPI app
│   ├── requirements.txt          # Python dependencies
│   ├── config/
│   │   └── db.py               # MongoDB config
│   ├── models/
│   │   └── authmodel.py         # User authentication
│   ├── routes/
│   │   ├── v1/                 # Gemini API endpoints
│   │   │   ├── contentgeneration.py
│   │   │   ├── pdf_summary_combined.py
│   │   │   ├── chatwithpdf.py
│   │   │   └── ...
│   │   └── v2/                 # Model-based endpoints
│   │       ├── pdf_chat_model.py
│   │       ├── quiz_model.py
│   │       ├── mcqs.py
│   │       └── ...
│   ├── Services/
│   │   ├── googlevertexai.py    # Gemini API wrapper
│   │   ├── pdfsummary.py
│   │   └── ...
│   ├── v2_model_services/
│   │   ├── embeddding_faiss_index.py    # FAISS Integration
│   │   ├── text_chunking.py             # Chunk processing
│   │   ├── retrieve_chunks.py           # RAG retrieval
│   │   ├── triplet_storage.py           # RDF storage
│   │   ├── triplet_retrieval.py         # Query triplets
│   │   └── ...
│   ├── utilities/
│   │   ├── utils.py
│   │   └── verifyJWTprotectedRoute.py
│   ├── triplet_storage/         # RDF triplets storage
│   ├── uploads/                 # Uploaded PDFs
│   └── tests/
│       ├── test_rag.py
│       ├── test_concept_graph.py
│       └── ...
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css
│   │   └── dashboard/
│   │       └── document-processing/
│   │           ├── chat/
│   │           ├── quiz/
│   │           ├── mcq/
│   │           ├── summarize/
│   │           └── ...
│   ├── components/
│   │   ├── ConceptGraphVisualizer.tsx
│   │   ├── process-cards.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api/
│   │   │   └── endpoints.ts     # API utilities
│   │   └── ...
│   ├── hooks/
│   ├── styles/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── postcss.config.mjs
│
├── docker-compose.yml           # Multi-container setup
├── README.md                    # This file
└── ...
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Test RAG pipeline
python tests/test_rag.py

# Test concept graph extraction
python tests/test_concept_graph.py

# Test triplet system
python tests/test_triplet_system.py

# Test API endpoints
python tests/test_quiz_api.py
python tests/test_parsing.py
```

### Frontend Tests

```bash
cd frontend

# Run linting
npm run lint

# Build verification
npm run build
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** with secure token refresh
- ✅ **CORS Configuration** for safe cross-origin requests
- ✅ **Session Management** with secure cookies
- ✅ **Environment Variables** for sensitive data
- ✅ **Encrypted Passwords** with bcrypt hashing
- ✅ **Protected Routes** with verification middleware
- ✅ **Input Validation** with Pydantic schemas

---

## 📈 Performance Metrics

### Benchmarks

| Operation | Time | Model |
|-----------|------|-------|
| PDF Summary (10 pages) | ~2-3s | Gemini 2.5 Flash |
| Chat Response | ~1-2s | Gemini 2.5 Flash |
| Quiz Generation | ~3-5s | Mistral 7B |
| FAISS Retrieval | <50ms | FAISS Index |
| Concept Graph | ~5-8s | Gemini / Mistral |

### Optimization Tips

- 🚀 Use FAISS GPU support for large-scale deployments
- 🔄 Implement caching for frequently accessed documents
- ⚡ Pre-generate embeddings during upload
- 📊 Monitor API usage and implement rate limiting

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📋 Roadmap

- [ ] Support for additional document formats (Word, Excel, images)
- [ ] Advanced multi-language support
- [ ] Real-time collaborative document editing
- [ ] Custom model fine-tuning interface
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Voice-based Q&A
- [ ] Batch processing API

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Built with ❤️ by the DOCxTRACT Team**

- **AI/ML Engineering** - Document processing & LLM integration
- **Backend Development** - FastAPI, RAG pipeline, vector search
- **Frontend Development** - Next.js, UI/UX, real-time features

---

## 📞 Support & Contact

- 📧 Email: support@docxtract.dev
- 🐛 Issues: [GitHub Issues](https://github.com/docxtract/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/docxtract/discussions)
- 📚 Documentation: [Full Docs](https://docs.docxtract.dev)

---

## 🙏 Acknowledgments

- Google Gemini API for powerful LLM capabilities
- FAISS for lightning-fast vector search
- Mistral AI for efficient local models
- FastAPI community for excellent documentation
- Next.js team for amazing frontend framework

---

<div align="center">

**⭐ If you found this helpful, please give us a star!**

Made with ❤️ for document intelligence

</div>
