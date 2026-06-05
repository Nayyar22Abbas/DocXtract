# 📄 DOCxTRACT - Intelligent Document Processing Platform

> Transform your documents into actionable insights with AI-powered analysis, semantic search, and intelligent retrieval.

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116%2B-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-Latest-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-FF6B6B?style=flat)](https://faiss.ai)

CI/CD Integrated | Cloud-Ready | Production-Tested

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

### 2. 💬 Chat with Documents
**Powered by:** Gemini 2.5 Flash API  
Ask natural language questions about your documents and receive contextual, accurate responses grounded in the document content through RAG.

### 3. 🔄 Document Comparison
**Powered by:** Gemini 2.5 Flash API  
Compare multiple documents side-by-side to identify differences, similarities, and complementary information.

### 4. 🧠 Concept Graph Visualization
**Powered by:** Gemini 2.5 Flash / Local Mistral  
Extract key concepts and their relationships from documents and visualize them as interactive force-directed graphs.

### 5. 📚 Quiz Generation
**Powered by:** Mistral 7B (Local Model)  
Auto-generate contextual quizzes from document content with multiple-choice or short-answer questions.

### 6. ❓ Multiple Choice Questions (MCQs)
**Powered by:** Mistral 7B (Local Model)  
Generate engaging MCQs with distractors for assessment and learning purposes.

### 7. 📖 Literature Review Generation
**Powered by:** Gemini 2.5 Flash API  
Synthesize insights across multiple research documents to create coherent literature reviews with proper citations.

### 8. 🔖 Smart Flashcards
**Powered by:** Gemini 2.5 Flash + Local Models  
Generate flashcards with source citations for spaced repetition learning.

### 9. 🧩 RDF Triplet Storage & Retrieval
**Powered by:** Gemini API + Semantic Search  
Store document knowledge as RDF triples (Subject-Predicate-Object) with intelligent indexing for fast retrieval and knowledge graph construction.

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

## � Production Deployment

### Backend Deployment

#### Option 1: Google Cloud Run
**Recommended for serverless deployment**

```bash
# 1. Create a Dockerfile for backend (already exists)
# 2. Build Docker image
docker build -t docxtract-backend .

# 3. Tag for Google Cloud Registry
docker tag docxtract-backend gcr.io/PROJECT_ID/docxtract-backend

# 4. Push to GCR
docker push gcr.io/PROJECT_ID/docxtract-backend

# 5. Deploy to Cloud Run
gcloud run deploy docxtract-backend \
  --image gcr.io/PROJECT_ID/docxtract-backend \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars GOOGLE_API_KEY=your_key,MONGODB_URI=your_mongo_uri \
  --allow-unauthenticated
```

**Environment Setup:**
```yaml
Environment Variables:
  - GOOGLE_API_KEY: Your Gemini API key
  - MONGODB_URI: MongoDB connection string
  - SESSION_SECRET: Secure session secret
  - CORS_ORIGINS: Allowed frontend URLs
```

**Monitoring:**
- Cloud Logging: Automatic logs aggregation
- Cloud Trace: Request tracing
- Cloud Monitoring: Performance metrics

---

#### Option 2: AWS App Engine
**For traditional managed hosting**

```bash
# 1. Create app.yaml
cat > app.yaml << EOF
runtime: python310

env: standard
entrypoint: gunicorn -w 4 -b 0.0.0.0:8000 index:app

env_variables:
  GOOGLE_API_KEY: "your_key"
  MONGODB_URI: "your_mongo_uri"

automatic_scaling:
  min_instances: 1
  max_instances: 10
EOF

# 2. Deploy
gcloud app deploy

# 3. View logs
gcloud app logs read -f
```

---

#### Option 3: Docker Compose on VPS
**For self-hosted deployment**

```bash
# 1. SSH into VPS
ssh user@your_vps_ip

# 2. Clone repository
git clone https://github.com/yourrepo/docxtract.git
cd docxtract

# 3. Create .env file
cat > .env << EOF
GOOGLE_API_KEY=your_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/docxtract
SESSION_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF

# 4. Create docker-compose override
cat > docker-compose.prod.yml << EOF
version: '3.8'
services:
  backend:
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/docs"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

# 5. Start with PM2 for auto-restart
npm install pm2 -g
pm2 start "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up" --name docxtract-backend
pm2 save
pm2 startup
```

**Nginx Reverse Proxy:**
```nginx
upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

#### Option 4: Kubernetes Deployment
**For enterprise-scale deployment**

```bash
# 1. Create namespace
kubectl create namespace docxtract

# 2. Create ConfigMap for environment
kubectl create configmap backend-config \
  --from-literal=MONGODB_URI="mongodb+srv://..." \
  --from-literal=GOOGLE_API_KEY="..." \
  -n docxtract

# 3. Create deployment
cat > k8s-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docxtract-backend
  namespace: docxtract
spec:
  replicas: 3
  selector:
    matchLabels:
      app: docxtract-backend
  template:
    metadata:
      labels:
        app: docxtract-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/PROJECT_ID/docxtract-backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: backend-config
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /docs
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /docs
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: docxtract-backend-service
  namespace: docxtract
spec:
  selector:
    app: docxtract-backend
  ports:
  - port: 8000
    targetPort: 8000
  type: LoadBalancer
EOF

# 4. Apply deployment
kubectl apply -f k8s-deployment.yaml

# 5. Check status
kubectl get pods -n docxtract
kubectl logs -f deployment/docxtract-backend -n docxtract
```

---

### Frontend Deployment

#### Option 1: Vercel (Recommended)
**Fastest and easiest deployment**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy (interactive)
vercel

# 3. Configure environment variables in Vercel dashboard
# Add: NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 4. Enable auto-deployment from GitHub
# Connect your GitHub repo in Vercel dashboard

# 5. Set custom domain
# Domain settings → Add custom domain
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  },
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=60, stale-while-revalidate=120"
        }
      ]
    }
  ]
}
```

---

#### Option 2: Netlify
**Alternative serverless platform**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Configure build settings
# Build command: npm run build
# Publish directory: .next/out
```

**Netlify Configuration (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = ".next/out"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://api.yourdomain.com"

[[redirects]]
  from = "/api/*"
  to = "https://api.yourdomain.com/:splat"
  status = 200
```

---

#### Option 3: Docker + Nginx (Self-hosted)
**For complete control**

```bash
# 1. Create .env.production
cat > frontend/.env.production << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF

# 2. Build Docker image
docker build -t docxtract-frontend -f frontend/Dockerfile frontend/

# 3. Run container
docker run -d \
  -p 3000:3000 \
  --name docxtract-frontend \
  --restart always \
  docxtract-frontend

# 4. Or with docker-compose
docker-compose -f frontend/docker-compose.yml up -d
```

**Frontend Dockerfile Optimization:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

**Nginx Configuration for Frontend:**
```nginx
upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location /_next/static {
        alias /app/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

#### Option 4: AWS Amplify
**Integrated AWS deployment**

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Initialize Amplify
amplify init

# 3. Add hosting
amplify add hosting

# 4. Publish
amplify publish

# 5. Monitor in AWS Console
# Amplify → App settings → Environment variables
```

**Environment Setup:**
```
NEXT_PUBLIC_API_URL = https://api.yourdomain.com
NEXT_PUBLIC_APP_URL = https://yourdomain.com
```

---

### Full Stack Deployment with GitHub Actions

**CI/CD Pipeline (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy DOCxTRACT

on:
  push:
    branches: [main, production]

jobs:
  backend-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          pip install -r requirements_safe.txt
      
      - name: Build and push Docker image
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT }}/docxtract-backend ./backend
          docker push gcr.io/${{ secrets.GCP_PROJECT }}/docxtract-backend
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy docxtract-backend \
            --image gcr.io/${{ secrets.GCP_PROJECT }}/docxtract-backend \
            --set-env-vars GOOGLE_API_KEY=${{ secrets.GOOGLE_API_KEY }}

  frontend-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build
        working-directory: ./frontend
        run: npm run build
      
      - name: Deploy to Vercel
        working-directory: ./frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod
```

---

## �🔌 API Endpoints

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

This project is licensed under the MIT License.

---

## 👥 Team

**Built with ❤️ by the DOCxTRACT Team**

- **AI/ML Engineering** - Document processing & LLM integration
- **Backend Development** - FastAPI, RAG pipeline, vector search
- **Frontend Development** - Next.js, UI/UX, real-time features

---

## 📞 Support & Contact

- 🐛 Issues: Report bugs via GitHub Issues
- 💬 Discussions: Join community discussions
- 📚 Documentation: Explore detailed documentation

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

Made with ❤️ for intelligent document processing

</div>

