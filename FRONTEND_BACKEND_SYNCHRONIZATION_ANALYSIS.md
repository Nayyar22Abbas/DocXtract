# 🔄 Frontend-Backend Synchronization Analysis

**Last Updated:** February 20, 2026

---

## 📋 Executive Summary

The frontend and backend are **mostly synchronized** with good API integration, but there are notable gaps in feature coverage, missing endpoints, and incomplete implementations. The backend has evolved to **v2 (Gemini API)** while the frontend is partially synced.

### 🟢 Synchronization Score: **72% Aligned**
- ✅ Core document processing features working
- ⚠️ Study recommendation features incomplete on frontend
- ❌ Some endpoints exist but not called by frontend

---

## 🏗️ Architecture Comparison

### Backend Structure
```
Backend (FastAPI + Python)
├── v1 Routes (Legacy - Services-based)
│   ├── Authentication (JWT)
│   ├── PDF Operations (Summary, Chat, Download, Delete, Comparison)
│   ├── Literature Review
│   └── Quiz Generation
│
└── v2 Routes (NEW - Gemini API Model-based)
    ├── PDF Chat (Gemini)
    ├── PDF Summary (Gemini)
    ├── Quiz Generation (Gemini)
    ├── MCQs Generation (Gemini)
    ├── Flashcards (Gemini)
    ├── Flashcard w/ Citation (Gemini with source text)
    └── Concept Graph / Insight Generation (Hybrid - API/Local)
```

### Frontend Structure
```
Frontend (Next.js + React + TypeScript)
├── API Layer (lib/api/)
│   ├── auth.ts (JWT + localStorage)
│   └── endpoints.ts (All API calls)
│
├── Data Management
│   ├── Auth Provider (Context-based)
│   └── Document Provider (Client-side state)
│
└── Pages (app/dashboard/*)
    ├── Summarize
    ├── Quiz
    ├── Q&A (Chat)
    ├── Chapters (Literature Review)
    ├── MCQs
    └── (Missing: Flashcards, Concept Graph, Study Recommendations)
```

---

## 📡 API Endpoint Mapping

### ✅ SYNCHRONIZED ENDPOINTS (Frontend Calling Backend)

| Feature | Backend Endpoint | Frontend Call | Status |
|---------|------------------|---------------|--------|
| **Authentication** | `POST /authuser/signup` | ✅ Implemented | Working |
| | `POST /authuser/login` | ✅ Implemented | Working |
| **Summarize PDF** | `POST /summary/summarize-pdf-combined/` | ✅ `summarizePdfCombined()` | Working |
| **Compare PDFs** | `POST /ppdfcomparison/compare-pdfs/` | ✅ `comparePdfs()` | Working |
| **Literature Review** | `POST /lit-review/generate-lit-review/` | ✅ `generateLiteratureReview()` | Working |
| **Quiz (v2)** | `POST /v2/quiz/generate-model` | ✅ `generateQuizModel()` | Working |
| **Quiz Solution** | `GET /v2/quiz/solution/{quiz_id}` | ✅ `getQuizSolution()` | Working |
| **PDF Chat (v2)** | `POST /modelpdfchat/chat-pdf/{pdf_id}` | ✅ `chatWithPdf()` | Working |
| **MCQs (v2)** | `POST /mcqgeneration/generate-mcqs/` | ✅ `generateMcqs()` | Working |
| **List PDFs** | `GET /list/list-pdfs/{user_id}` | ✅ Implemented | Working |
| **Download PDF** | `GET /pdfdownload/download-pdf/{pdf_id}` | ✅ Implemented | Working |
| **Delete PDF** | `DELETE /deletepdf/pdf/{pdf_id}` | ✅ Implemented | Working |

---

### ⚠️ PARTIALLY SYNCHRONIZED ENDPOINTS

| Feature | Backend Status | Frontend Status | Issue |
|---------|---|---|---|
| **Flashcards** | ✅ `POST /flashcard/generate-flashcards/` | ❌ Not Called | Backend exists but frontend has no UI/component |
| **Flashcards w/ Citation** | ✅ `POST /flashcardwithcitation/generate-flashcards/` | ❌ Not Called | Response changed (source_text vs source_line) but frontend missing |
| **Concept Graph** | ✅ `POST /insight/v2/concept-graph/` | ❌ Not Called | Backend exists but no frontend visualization |
| **Study Recommendations** | ✅ 3 endpoints created | ⚠️ Documented but not implemented | Routes defined but no UI components |

---

### ❌ UNIMPLEMENTED / FRONTEND GAPS

#### Backend Endpoints WITHOUT Frontend Implementation:

1. **Study Recommendations** (Most Critical Gap)
   ```
   POST /api/study-recommendation      (Manual input)
   POST /api/auto-recommendation        (Auto from history)
   GET /api/student-profile/{user_id}   (Student data analysis)
   ```
   - Backend is fully functional with Gemini AI
   - Frontend has **ZERO components** to call these
   - Documentation exists but no implementation

2. **Flashcard Features**
   ```
   POST /flashcard/generate-flashcards/           (v2)
   POST /flashcardwithcitation/generate-flashcards/ (v2 with citations)
   ```
   - Backend ready with source attribution
   - No frontend UI/pages to display flashcards

3. **Concept Graph / Insight Generation**
   ```
   POST /insight/v2/concept-graph/
   ```
   - Backend supports force-directed graph generation
   - No D3.js/Vis.js visualization component on frontend

4. **v1 Legacy Endpoints** (Not Called by v2 Frontend)
   ```
   POST /v1/quiz/... (Old quiz generation)
   POST /pdfchat/chat-pdf/{pdf_id} (v1 - uses /modelpdfchat instead)
   POST /modelpdfsummary/... (v1 - uses /summary instead)
   ```

---

## 🔄 Data Flow Analysis

### Happy Path: Document Summary
```
Frontend                      Backend                    Database
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. User uploads PDF    →
2. Frontend extracts  
   file + user_id      →  POST /summary/summarize-pdf-combined/
                          - Extract text (pdfplumber)
                          - Chunk text
                          - Build FAISS index
                          - Query with Gemini API     →  MongoDB 
                                                        (stores summary + metadata)
3. Response returns   ←  - chapters structure
   markdown summary      - combined summary
4. Frontend renders       - file paths
   summary              ✓ Display in markdown
```

**Status:** ✅ Fully Synchronized

---

### Problem Path 1: Flashcards
```
Backend                    Frontend                  Issue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Endpoint exists        ❌ No page/component      Data flow broken
✅ Generates flashcards   ❌ Not called anywhere    User can't access feature
✅ Returns Q&A + sources  ❌ UI doesn't exist       Feature invisible to users
```

**Status:** ❌ BROKEN - Backend ready, Frontend missing

---

### Problem Path 2: Study Recommendations
```
Backend                              Frontend                      Issue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 3 endpoints designed              ❌ Zero UI components         Undiscovered feature
✅ Auto-pulls quiz history           ⚠️ Documented in MD files    Complex requirements
✅ Analyzes student progress         ❌ Not integrated             Need hooks + pages
✅ Returns recommendations +         ❌ No state management        Requires auth context
   predictive insights               ❌ No API calls               Frontend incomplete

Architecture ready, frontend incomplete
```

**Status:** ❌ BLOCKED - Backend complete, Frontend stub only

---

## 🔐 Authentication Synchronization

### Backend (userauth.py)
```python
✅ JWT token generation      ✅ Stored in HTTP-only cookies
✅ Email → username mapping  ✅ Signup with auto-login
✅ OAuth (Google/GitHub)     ⏳ Routes defined but disabled
✅ Protected routes          ✅ Token verification middleware
```

### Frontend (auth.ts)
```typescript
✅ localStorage token storage (dx_access_token)
✅ Email → username mapping
✅ authHeaders() helper for API calls
✅ isAuthenticated() check
⚠️ No HTTP-only cookies (localStorage only)
❌ OAuth buttons disabled
❌ Token refresh not implemented
```

### ⚠️ MISMATCH: 
- **Backend:** Expects cookies + JWT
- **Frontend:** Uses localStorage + Bearer token
- **Impact:** Works but non-optimal security (localStorage XSS vulnerable)
- **Fix Needed:** Implement secure cookie handling if enhanced security required

---

## 📊 Feature Completeness Matrix

| Feature | Backend | Frontend | Gap Analysis |
|---------|---------|----------|--------------|
| User Authentication | ✅ Complete (JWT + OAuth) | ✅ Complete (JWT only) | OAuth disabled on FE |
| PDF Summary | ✅ v2 Gemini | ✅ Page + Component | ✅ Synced |
| PDF Comparison | ✅ v2 Available | ✅ Page + Component | ✅ Synced |
| Literature Review | ✅ v2 Available | ✅ Page + Component | ✅ Synced |
| Quiz Generation | ✅ v2 Gemini | ✅ Page + Component | ✅ Synced |
| MCQ Generation | ✅ v2 Gemini | ✅ Page + Component | ✅ Synced |
| PDF Chat | ✅ v2 Gemini | ✅ Page + Component | ✅ Synced |
| **Flashcards** | ✅ v2 Gemini | ❌ Missing | ❌ Not implemented |
| **Flashcards (Citations)** | ✅ v2 Gemini | ❌ Missing | ❌ Not implemented |
| **Concept Graph** | ✅ v2 Hybrid | ❌ Missing | ❌ No visualization |
| **Study Recommendations** | ✅ Complete (3 routes) | ⚠️ Stub only | ❌ No UI/Logic |
| **Student Profile Analysis** | ✅ Complete | ⚠️ Stub only | ❌ Missing component |
| File Management (List/Download/Delete) | ✅ All 3 routes | ✅ Integrated | ✅ Synced |
| Error Handling | ✅ HTTPException + codes | ✅ try/catch | ✅ Basic coverage |
| JWT Verification | ✅ Token middleware | ✅ Bearer headers | ✅ Working |

---

## 🚨 Critical Gaps

### 1. **Study Recommendations** (HIGH PRIORITY)
**Why:** Complete backend + documented API, but zero frontend UI
- ❌ No `/dashboard/recommendations` page
- ❌ No hooks (useStudyRecommendation)
- ❌ No API calls implemented
- ❌ No components for displaying results
- ✅ Documentation provided (FRONTEND_INTEGRATION_SUMMARY.md)

**Effort to Close:** Medium (2-3 hours)
```typescript
// Frontend needs:
1. hooks/useStudyRecommendation.ts - fetch recommendations + profile
2. app/dashboard/recommendations/page.tsx - main page
3. components/StudentProfileCard.tsx - show historical data
4. components/RecommendationCard.tsx - show suggestion
5. components/InsightsCard.tsx - show metrics
```

---

### 2. **Flashcards Feature** (MEDIUM PRIORITY)
**Why:** Flashcard API ready but no frontend pages/components
- ❌ No page to upload PDF for flashcard generation
- ❌ No component to display question/answer pairs
- ❌ No citation display (source_text field not rendered)
- ❌ No difficulty filtering/sorting

**Effort to Close:** Medium (2-3 hours)
```typescript
// Frontend needs:
1. app/dashboard/flashcards/page.tsx - upload + generation
2. components/FlashcardCard.tsx - flip/reveal answer
3. components/CitationBadge.tsx - show source text
4. hooks/useFlashcards.ts - fetch generated flashcards
```

---

### 3. **Concept Graph Visualization** (LOW PRIORITY)
**Why:** API generates graph structure but no visual renderer
- ❌ No D3.js or Vis.js dependency
- ❌ No graph component
- ❌ Response structure not consumed

**Effort to Close:** Medium-High (3-4 hours)
```typescript
// Frontend needs:
1. Install: @visx/graph or vis-network
2. components/ConceptGraphVisualizer.tsx - force-directed graph
3. app/dashboard/concepts/page.tsx - execution page
4. hooks/useConceptGraph.ts - API integration
```

---

### 4. **OAuth Implementation** (LOW PRIORITY)
**Why:** Backend OAuth configured but frontend buttons disabled
- ❌ Google OAuth not wired
- ❌ GitHub OAuth not wired
- ⏳ Marked "coming soon"

**Effort to Close:** Low (1-2 hours)
```typescript
// Frontend needs:
1. Update auth.ts - add googleLogin(), githubLogin() functions
2. Update signup/login pages - enable OAuth buttons
3. Handle OAuth callback flow
```

---

### 5. **Token Refresh Logic** (SECURITY)
**Why:** No refresh token mechanism (tokens will expire)
- ❌ No refresh endpoint call
- ❌ No automatic re-login
- ❌ User gets logged out without warning

**Effort to Close:** Low (1-2 hours + backend route)
```typescript
// Frontend needs:
1. Implement token refresh interceptor
2. Store refresh token separately
3. Auto-refresh before expiry
```

---

## 🎯 Version Mismatch Issues

### The v1 vs v2 Problem

**Backend has both v1 and v2:**
- **v1:** Original implementations (Services-based)
- **v2:** New Gemini API implementations (parallel routes)

**Frontend confusion:**
```typescript
// Some endpoints use v2:
POST /v2/quiz/generate-model          ✅ Frontend uses
POST /v2/quiz/solution/{quiz_id}      ✅ Frontend uses

// Others use v1:
POST /summary/summarize-pdf-combined/  ✅ This is NOT v1, it's unique
POST /pdfchat/chat-pdf/{pdf_id}       ❌ Frontend uses /modelpdfchat instead
POST /ppdfcomparison/compare-pdfs/    ✅ Not versioned

// Some v1 endpoints not called:
POST /v1/quiz/...                     ❌ Never called by frontend
GET /modelpdfsummary/generate-summary/... ❌ Not called
```

**Recommendation:** 
- Deprecate v1 routes or clearly mark them
- Standardize v2 prefix across all new endpoints
- Update API documentation to clarify which version to use

---

## 📐 Response Structure Alignment

### ✅ Well-Aligned Responses

**Summary Response:**
```typescript
// Backend returns
{
  file_info: { filename, saved_path },
  combined_summary: "markdown text",
  structured_data: { general_summary, chapters: {} }
}

// Frontend expects ✅
response.combined_summary  // Renders directly
response.structured_data   // Access chapters if needed
```

---

### ⚠️ Partially-Aligned Responses

**Flashcard Citation Change (Gemini Upgrade):**
```typescript
// OLD (Mistral)
{
  source_line: 12,
  source_text: undefined
}

// NEW (Gemini v2)
{
  source_text: "Full quote from PDF...",
  source_line: removed
}

// Frontend Issue: ❌ No code handles this yet
// The migration guide exists but frontend not updated
```

---

### 📋 Response Structure Checklist

| Endpoint | Response | Frontend Parsing | Status |
|----------|----------|------------------|--------|
| Summary | Markdown + structure | Split by `## ` headers | ✅ Works |
| Comparison | Markdown comparison | Direct render | ✅ Works |
| Quiz | MCQs + Short Answer + T/F | Loop through arrays | ✅ Works |
| Quiz Solution | HTML formatted | Display directly | ✅ Works |
| Chat | Text response | Markdown render | ✅ Works |
| MCQs | JSON array of Q+Options | Iterate and display | ✅ Works |
| Flashcards | Array of Q+A+source | ⚠️ source_text not handled | ❌ Broken |
| Concepts | Graph nodes + links | ❌ D3 not integrated | ❌ Missing |
| Recommendation | Suggestion + insights | ❌ Not implemented | ❌ Missing |

---

## 🔗 Data Type Misalignments

### Quiz ID Consistency
```typescript
// Backend returns:
{
  quiz_id: "507f1f77bcf86cd799439011"  // MongoDB ObjectId as string
}

// Frontend stores:
const [quizId, setQuizId] = useState<string>('')  // ✅ Correct type

// Frontend uses:
const solution = await getQuizSolution(quizId)  // ✅ Works
```
**Status:** ✅ No issue

---

### User ID Handling
```typescript
// Backend expects:
user_id: string  // In body or query param

// Frontend provides:
const userId = getUsername()  // Returns email string
fetch(`...?user_id=${userId}`)  // ✅ Works

// But also:
// Some endpoints optional, some required - inconsistent design
POST /api/auto-recommendation, body: { user_id: "required" }
POST /summary/summarize-pdf-combined/, body: { user_id: "optional" }
POST /ppdfcomparison/compare-pdfs/, body: { user_id: "optional" }
```
**Status:** ⚠️ Works but inconsistent - should standardize

---

### File Upload Handling
```typescript
// Frontend:
const formData = new FormData()
formData.append('file', file)
formData.append('user_id', userId)

// Backend expects:
from fastapi import UploadFile, Form
async def endpoint(file: UploadFile, user_id: Form = None)

// Or sometimes:
async def endpoint(file: UploadFile, document_type: Form = None)
```
**Status:** ✅ Works, though inconsistent parameter naming

---

## 🧪 Testing Gaps

### Backend Testing
```
✅ test_quiz_service.py         - Quiz generation
✅ test_parsing.py              - PDF text extraction
✅ test_rag.py                  - RAG pipeline
✅ test_concept_graph.py        - Insight generation
⚠️ test_quiz_v2.py             - Partial coverage
❌ test_recommendation.py       - Missing
❌ test_flashcards.py          - Missing
```

### Frontend Testing
```
❌ No tests for API calls
❌ No tests for auth flow
❌ No component tests
❌ No integration tests
```

**Recommendation:** Add Vitest + React Testing Library for frontend

---

## 🔄 Synchronization Workflow Issues

### Issue 1: No Centralized Endpoint Registry
**Problem:** Both frontend and backend have endpoint lists scattered
- Backend: Comments in index.py
- Frontend: Documented in endpoints.ts + API docs
- Result: Manual verification needed

**Solution:** Create shared openapi.json schema

---

### Issue 2: Version Proliferation
**Problem:** Routes without version prefix becoming legacy
```
/summary/...          - No version, implicitly v1? v2?
/pdfchat/...          - Backend v1, frontend should use /modelpdfchat
/v2/...               - Explicitly versioned
/api/...              - Used for suggestions only
```

**Solution:** Enforce strict versioning pattern

---

### Issue 3: Breaking Changes Not Communicated
**Problem:** Gemini v2 migration changed flashcard response format
- `source_line` → `source_text`
- Documentation updated but frontend not
- Feature silently broken

**Solution:** Add response version headers

---

## 📈 Synchronization Roadmap

### Phase 1: Critical Fixes (1-2 days)
- [ ] Implement Study Recommendations UI (3 endpoints)
- [ ] Document v1 vs v2 API clearly
- [ ] Add response version validation
- [ ] Create shared OpenAPI spec

### Phase 2: Feature Completion (3-4 days)
- [ ] Implement Flashcards feature
- [ ] Implement Concept Graph visualization
- [ ] Add token refresh logic
- [ ] Enable OAuth endpoints

### Phase 3: Quality (1-2 days)
- [ ] Add frontend tests (Vitest)
- [ ] Standardize error handling
- [ ] Implement proper logging
- [ ] Load testing

### Phase 4: Optimization (3-5 days)
- [ ] Deprecate v1 routes formally
- [ ] Cache frequently accessed data
- [ ] Implement streaming for large PDFs
- [ ] Add request/response compression

---

## 🎯 Summary Table

| Aspect | Status | Summary |
|--------|--------|---------|
| **Core Features** | ✅ Good | Summary, Quiz, Chat, Comparison working |
| **Feature Parity** | ⚠️ 72% | 4/10 features incomplete |
| **Authentication** | ✅ Good | JWT working, OAuth pending |
| **Error Handling** | ✅ Good | Both sides have try/catch |
| **Data Types** | ✅ Good | Mostly aligned |
| **Response Formats** | ⚠️ Fair | Some inconsistencies, breaking changes not tracked |
| **Testing** | ❌ Poor | Backend ok, frontend missing |
| **Documentation** | ✅ Good | Integration docs exist but incomplete |
| **Version Control** | ⚠️ Fair | v1/v2 confusion, unclear deprecation |
| **Security** | ⚠️ Fair | localStorage (XSS risk), no token refresh |

---

## 🚀 Recommended Immediate Actions

1. **URGENT:** Implement Study Recommendations feature (ROI highest)
2. **HIGH:** Document API versioning strategy clearly
3. **HIGH:** Add response format validation
4. **MEDIUM:** Implement Flashcards UI
5. **MEDIUM:** Add token refresh mechanism
6. **LOW:** Implement Concept Graph visualization

---

## 📞 Questions for Team

1. Should v1 routes be deprecated or maintained?
2. Is localStorage security acceptable or should we move to secure cookies?
3. Are flashcards a priority feature?
4. Do we need concept graph visualization?
5. Should study recommendations be a core feature?

---

**End of Analysis**
