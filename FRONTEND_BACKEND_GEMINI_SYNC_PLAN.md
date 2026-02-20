# 🎯 Frontend-Backend Full Gemini Synchronization Plan

**Date:** February 20, 2026  
**Goal:** Sync frontend with ALL Gemini-based backend endpoints  
**Scope:** Frontend ONLY - NO backend changes  
**Status:** Planning Phase

---

## 📊 Executive Summary

### Backend Status: ✅ READY
- **13 Gemini-based endpoints** fully functional
- **4 Gemini models available:** Gemini 2.5 Flash, study recommendation AI, etc.
- **All endpoints documented** with clear request/response structures
- **MongoDB integration** for data persistence

### Frontend Status: ⚠️ INCOMPLETE
- **6/13 endpoints** properly implemented with UI
- **4 major features missing** UI components
- **3 folders exist but are empty** (concepts, citation, insights)
- **Confusion:** Some folders deleted from COMPLETION_REPORT but backend APIs still exist

### Sync Gap: **54% (7/13 endpoints missing frontend)**

---

## 🔗 Endpoint Mapping: Backend ↔ Frontend

### ✅ FULLY IMPLEMENTED (6 endpoints)

| # | Endpoint | Backend | Frontend Page | Status |
|---|----------|---------|---------------|--------|
| 1 | POST /summary/summarize-pdf-combined/ | ✅ Gemini | /summarize | ✅ Complete |
| 2 | POST /ppdfcomparison/compare-pdfs/ | ✅ Gemini | /comparison | ✅ Complete |
| 3 | POST /lit-review/generate-lit-review/ | ✅ Gemini | /literature-review | ✅ Complete |
| 4 | POST /v2/quiz/generate-model | ✅ Gemini* | /quiz | ✅ Complete |
| 5 | POST /mcqgeneration/generate-mcqs/ | ✅ Gemini | /mcq | ✅ Complete |
| 6 | POST /pdfchat/chat-pdf/{pdf_id} | ✅ Gemini | /qa | ✅ Complete |

*Note: Quiz endpoint is named `generate_quiz_mistral()` but actually uses Gemini 2.5 Flash

---

### ⚠️ PARTIALLY IMPLEMENTED (0 endpoints)

N/A - Either fully done or not done

---

### ❌ MISSING IMPLEMENTATION (7 endpoints)

| # | Endpoint | Backend | Frontend Page | Issue |
|---|----------|---------|---------------|-------|
| 7 | POST /flashcard/generate-flashcards/ | ✅ Gemini | ❌ Missing | No UI to generate flashcards |
| 8 | POST /flashcardwithcitation/generate-flashcards/ | ✅ Gemini | ❌ Missing | Folder exists but empty |
| 9 | POST /insight/v2/concept-graph/ | ✅ Gemini (Hybrid) | ❌ Missing | Folder exists but no D3/Force-graph visualization |
| 10 | POST /api/auto-recommendation | ✅ Gemini | ❌ Missing | No UI page or components |
| 11 | GET /api/student-profile/{user_id} | ✅ Gemini | ❌ Missing | No profile display component |
| 12 | POST /api/study-recommendation | ✅ Gemini | ❌ Missing | No manual recommendation UI |
| 13 | POST /api/topic-guidance | ✅ Gemini | ❌ Missing | Advanced recommendation feature |

---

## 🗂️ Frontend Structure Analysis

### Existing Document Processing Pages
```
frontend/app/dashboard/document-processing/
├── summarize/page.tsx          ✅ Implemented
├── comparison/page.tsx          ✅ Implemented
├── literature-review/page.tsx   ✅ Implemented
├── quiz/page.tsx                ✅ Implemented
├── mcq/page.tsx                 ✅ Implemented
├── qa/page.tsx                  ✅ Implemented (chat)
├── citation/page.tsx            ⚠️ Empty folder
├── concepts/page.tsx            ⚠️ Empty folder
├── insights/page.tsx            ⚠️ Empty folder
├── chat/page.tsx                ⚠️ Exists (duplicate of qa?)
└── page.tsx                     (Main document processing page)
```

### What Exists
- [x] Page structure for all features
- [x] API endpoints documented
- [x] Backend endpoints providing data
- [x] Authentication working

### What's Missing
- [ ] Flashcard generation UI
- [ ] Flashcard display components
- [ ] Concept graph visualization
- [ ] Study recommendation page
- [ ] Student profile display
- [ ] Dynamic form for manual recommendations

---

## 📋 Implementation Plan (By Priority)

### Phase 1: Core Missing Features (CRITICAL - 3-4 days)

#### 1.1 Flashcards Feature with Citation
**Endpoints:** POST /flashcard/, POST /flashcardwithcitation/

**What Frontend Needs:**
1. Update `/citation/page.tsx`:
   - File upload component
   - Max cards slider (1-20)
   - Difficulty filter toggle
   - Generate button with loading state

2. Create `components/FlashcardDisplay.tsx`:
   - Card flip animation (show Q/A)
   - Citation badge with source text
   - Difficulty indicator
   - Copy/share functionality

3. Create Hook: `hooks/useFlashcards.ts`:
   ```typescript
   // Fetch generated flashcards
   // Handle both endpoints (with/without citation)
   // Return parsed flashcard array
   ```

4. Update API endpoints: `lib/api/endpoints.ts`:
   ```typescript
   export async function generateFlashcards(file: File, maxCards?: number)
   export async function generateFlashcardsWithCitation(file: File, maxCards?: number)
   ```

**Response Handling:**
```typescript
// From backend
{
  question: string,
  answer: string,
  difficulty: "Easy" | "Medium" | "Hard",
  source_text: string  // NEW: must display this
}
```

**Effort:** 2-3 hours  
**Dependencies:** None (use existing Framer Motion)  
**Complexity:** Low

---

#### 1.2 Concept Graph Visualization
**Endpoint:** POST /insight/v2/concept-graph/

**What Frontend Needs:**

1. Install visualization library:
   ```bash
   npm install react-force-graph
   # OR
   npm install vis-network
   ```

2. Create `components/ConceptGraphVisualizer.tsx`:
   - Force-directed graph rendering
   - Node tooltips showing concept names
   - Link labels showing relationships
   - Zoom/pan controls
   - Color coding by concept type

3. Update `/concepts/page.tsx`:
   - File upload
   - use_api toggle (default: true for Gemini)
   - max_concepts slider (5-30)
   - Graph display area

4. Create Hook: `hooks/useConceptGraph.ts`:
   ```typescript
   // POST to /insight/v2/concept-graph/
   // Handle response: { graph: { nodes, links } }
   // Manage loading/error states
   ```

5. Update API: `lib/api/endpoints.ts`:
   ```typescript
   export async function generateConceptGraph(
     file: File, 
     useApi?: boolean, 
     maxConcepts?: number
   )
   ```

**Response Handling:**
```typescript
{
  pdf_name: string,
  engine: "Gemini API" | "Local Mistral",
  graph: {
    nodes: [{ id, label, type }],
    links: [{ source, target, relation }]
  }
}
```

**Effort:** 3-4 hours  
**Dependencies:** react-force-graph or vis-network  
**Complexity:** Medium

---

#### 1.3 Study Recommendations System
**Endpoints:** POST /api/auto-recommendation, GET /api/student-profile/{user_id}, POST /api/study-recommendation

**What Frontend Needs:**

1. Create `/study-recommendations/page.tsx` (new folder):
   - Tab switching: "Auto" vs "Manual"
   - Loading states

2. Create `components/StudentProfileCard.tsx`:
   - Display enrolled subjects
   - Show quiz trends (average, improvement, consistency)
   - List weak topics with scores
   - Display study time patterns
   - Show upcoming exams

3. Create `components/RecommendationCard.tsx`:
   - Priority subject (highlighted)
   - Recommended topic
   - Daily study minutes (with icon)
   - Reasoning (expandable)
   - Motivation message (inspirational quote-style)

4. Create `components/InsightsCard.tsx`:
   - Quiz trend indicator (Improving/Declining/Stable)
   - Average score with chart
   - Score improvement % (with arrow)
   - Study consistency badge
   - Quizzes analyzed count
   - Weak areas identified count
   - Confidence level indicator

5. Create Hook: `hooks/useStudyRecommendation.ts`:
   ```typescript
   const { 
     loading, 
     studentProfile, 
     recommendation, 
     insights, 
     error, 
     fetchAuto,
     fetchManual,
     fetchProfile 
   } = useStudyRecommendation(userId);
   ```

6. Create Form Component: `components/ManualRecommendationForm.tsx`:
   - Multi-select for subjects
   - Number inputs for quiz scores (per subject)
   - Multi-tag input for weak topics
   - Study time slider
   - Date picker for exams
   - Submit button

7. Update API: `lib/api/endpoints.ts`:
   ```typescript
   export async function getAutoRecommendation(userId: string, includeAnalysis?: boolean)
   export async function getStudentProfile(userId: string)
   export async function getManualRecommendation(data: RecommendationRequest)
   export async function getTopicGuidance(data: TopicGuidanceRequest)
   ```

**Response Handling:**
```typescript
// Auto-recommendation response
{
  success: boolean,
  recommendation: {
    priority_subject: string,
    recommended_topic: string,
    recommended_daily_study_minutes: string,
    reasoning: string,
    motivation_message: string,
    generated_at: string
  },
  predictive_insights: {
    quiz_trend: string,
    average_quiz_score: number,
    score_improvement: number,
    study_consistency: string,
    quizzes_analyzed: number,
    weak_areas_identified: number
  }
}

// Student profile response
{
  success: boolean,
  student_profile: {
    enrolled_subjects: string[],
    quiz_trends: { trend, average_score, improvement, consistency },
    weak_topics: [string, number][],
    study_time_pattern: { average_daily_study_minutes, pattern },
    upcoming_exams: string[]
  }
}
```

**Effort:** 4-5 hours  
**Dependencies:** recharts or chart.js (for trends), react-select (for multi-select)  
**Complexity:** High

---

### Phase 2: Polish & Enhancement (1-2 days)

#### 2.1 Update Process Cards Navigation
Update `components/process-cards.tsx`:
- Add cards for Flashcards, Concepts, Study Recommendations
- Update descriptions
- Add icons
- Update routing

#### 2.2 Create API Helper Functions
Consolidate all missing endpoints in `lib/api/endpoints.ts`:
- generateFlashcards()
- generateFlashcardsWithCitation()
- generateConceptGraph()
- getAutoRecommendation()
- getStudentProfile()
- getManualRecommendation()
- getTopicGuidance()

**Each function should include:**
- Proper TypeScript types
- Error handling
- Response validation
- JSDoc comments

#### 2.3 Update Dashboard Layout
- Add new navigation items to sidebar
- Update document-processing main page layout
- Ensure consistent styling

#### 2.4 Add Loading States
- Create `components/LoadingGraphSkeleton.tsx` for graph visualization
- Create `components/LoadingCardsSkeleton.tsx` for flashcards
- Create `components/LoadingRecommendationSkeleton.tsx` for recommendations

---

### Phase 3: Testing & Validation (1 day)

#### 3.1 Functional Testing
- [ ] Test all 7 missing endpoints
- [ ] Verify response parsing
- [ ] Test error cases
- [ ] Test with various file sizes

#### 3.2 UI/UX Testing
- [ ] Responsive design on mobile
- [ ] Accessibility (a11y)
- [ ] Loading state duration
- [ ] Error messages clarity

#### 3.3 Integration Testing
- [ ] Full data flow from upload to display
- [ ] Cross-feature navigation
- [ ] Authentication token passing
- [ ] File cleanup after processing

---

## 📝 Updated File Structure After Implementation

```
frontend/
├── app/dashboard/document-processing/
│   ├── citation/
│   │   └── page.tsx             ← IMPLEMENT: Flashcards UI
│   ├── comparison/page.tsx       ✅ Keep as-is
│   ├── concepts/
│   │   └── page.tsx             ← IMPLEMENT: Concept Graph
│   ├── literature-review/page.tsx ✅ Keep as-is
│   ├── mcq/page.tsx             ✅ Keep as-is
│   ├── quiz/page.tsx            ✅ Keep as-is
│   ├── qa/page.tsx              ✅ Keep as-is
│   ├── study-recommendations/   ← NEW FOLDER
│   │   └── page.tsx             ← IMPLEMENT: Recommendations
│   ├── summarize/page.tsx       ✅ Keep as-is
│   ├── chat/page.tsx            (Review: duplicate of qa?)
│   └── page.tsx                 ✅ Update navigation
│
├── components/
│   ├── FlashcardDisplay.tsx     ← NEW
│   ├── ConceptGraphVisualizer.tsx ← NEW
│   ├── StudentProfileCard.tsx   ← NEW
│   ├── RecommendationCard.tsx   ← NEW
│   ├── InsightsCard.tsx         ← NEW
│   ├── ManualRecommendationForm.tsx ← NEW
│   ├── LoadingGraphSkeleton.tsx ← NEW
│   ├── LoadingCardsSkeleton.tsx ← NEW
│   ├── LoadingRecommendationSkeleton.tsx ← NEW
│   └── process-cards.tsx        ← UPDATE
│
├── hooks/
│   ├── useFlashcards.ts         ← NEW
│   ├── useConceptGraph.ts       ← NEW
│   └── useStudyRecommendation.ts ← NEW
│
├── lib/api/
│   └── endpoints.ts             ← UPDATE: Add 7 new functions
│
└── [other files unchanged]
```

---

## 🔌 API Integration Required

### New Functions to Add in `lib/api/endpoints.ts`

```typescript
// Flashcards
export async function generateFlashcards(file: File, maxCards?: number)
export async function generateFlashcardsWithCitation(file: File, maxCards?: number)

// Concept Graph
export async function generateConceptGraph(
  file: File, 
  useApi?: boolean, 
  maxConcepts?: number
)

// Study Recommendations
export async function getAutoRecommendation(userId: string, includeAnalysis?: boolean)
export async function getStudentProfile(userId: string)
export async function getManualRecommendation(data: RecommendationRequest)
export async function getTopicGuidance(data: TopicGuidanceRequest)
export async function analyzeProgress(data: ProgressAnalysisRequest)
```

---

## 📦 Dependencies to Add

```json
{
  "react-force-graph": "^1.x.x",
  "recharts": "^2.x.x",
  "react-select": "^5.x.x"
}
```

**Optional (if using vis-network instead of react-force-graph):**
```json
{
  "vis-network": "^9.x.x",
  "vis-data": "^7.x.x"
}
```

---

## 🗑️ Cleanup: Delete These MD Files

These docs will be consolidated into this single plan:

1. ❌ Delete: `FRONTEND_INTEGRATION_SUMMARY.md`
   - Reason: Study recommendation docs already in STUDY_RECOMMENDATION_README.md
   - Content: Moved to Phase 1.3 of this plan

2. ❌ Delete: `V2_API_MIGRATION_GUIDE.md`
   - Reason: Outdated concept of v1 vs v2 migration
   - Content: Relevant info integrated into endpoints mapping

3. ❌ Delete: `CONCEPT_GRAPH_FRONTEND_INTEGRATION.md`
   - Reason: Specific implementation in Phase 1.2 of this plan
   - Content: Moved to Phase 1.2

4. ❌ Delete: `COMPLETION_REPORT.md`
   - Reason: Contradicts current backend (says features removed but they exist)
   - Content: Historical only, keeping for archive reference

5. ✅ Keep: `frontend/INTEGRATION_CHANGES.md`
   - Reason: Documents authentication flow (current and relevant)

6. ✅ Keep: `STUDY_RECOMMENDATION_README.md`
   - Reason: Backend service documentation (informative)

---

## 🎯 Implementation Checklist

### Pre-Implementation
- [ ] Read this plan completely
- [ ] Create feature branches for each phase
- [ ] Set up testing environment
- [ ] Create issue tickets in project management

### Phase 1: Core Features
- [ ] 1.1 Flashcards Feature
  - [ ] Create citation/page.tsx
  - [ ] Create FlashcardDisplay.tsx
  - [ ] Create useFlashcards.ts hook
  - [ ] Update endpoints.ts with functions
  - [ ] Test both endpoints
  
- [ ] 1.2 Concept Graph
  - [ ] npm install react-force-graph
  - [ ] Create concepts/page.tsx
  - [ ] Create ConceptGraphVisualizer.tsx
  - [ ] Create useConceptGraph.ts hook
  - [ ] Update endpoints.ts with function
  - [ ] Test visualization with sample data
  
- [ ] 1.3 Study Recommendations
  - [ ] Create study-recommendations/page.tsx
  - [ ] Create StudentProfileCard.tsx
  - [ ] Create RecommendationCard.tsx
  - [ ] Create InsightsCard.tsx
  - [ ] Create ManualRecommendationForm.tsx
  - [ ] Create useStudyRecommendation.ts hook
  - [ ] Update endpoints.ts with all functions
  - [ ] Test all three endpoints

### Phase 2: Polish
- [ ] Update process-cards.tsx
- [ ] Update dashboard navigation
- [ ] Create loading skeletons
- [ ] Ensure consistent styling
- [ ] Update document-processing main page

### Phase 3: Validation
- [ ] Functional testing (all 7 endpoints)
- [ ] Responsive design testing
- [ ] Error case testing
- [ ] Cross-browser testing

### Final Cleanup
- [ ] Delete obsolete MD files
- [ ] Update documentation
- [ ] Commit all changes
- [ ] Create pull request

---

## 📊 Timeline Estimate

| Phase | Task | Days | Hours |
|-------|------|------|-------|
| 1.1 | Flashcards | 1 | 2-3 |
| 1.2 | Concept Graph | 1.5 | 3-4 |
| 1.3 | Study Recommendations | 2 | 4-5 |
| 2 | Polish & Enhancement | 1 | 4-5 |
| 3 | Testing & Validation | 1 | 4-6 |
| | **TOTAL** | **6-7 days** | **17-23 hours** |

---

## 🎯 Success Criteria

✅ **When this plan is complete, the frontend will:**

1. Have UI for ALL 13 Gemini endpoints
2. Display flashcards with proper citation (source_text)
3. Render concept graph with force-directed visualization
4. Show student profile with quiz trends
5. Generate auto-recommendations based on history
6. Support manual recommendations with form input
7. Have consistent styling with existing features
8. Include proper error handling and loading states
9. Pass functional and responsive testing
10. Be fully documented with JSDoc comments

---

## 🚀 Next Steps

1. **Review this plan** with the team
2. **Create GitHub issues** for each phase
3. **Start Phase 1.1** (Flashcards)
4. **Run tests continuously** during development
5. **Document any blockers** and solutions
6. **Delete old MD files** after implementation

---

## 📞 Notes

- **No backend changes required** - All endpoints are ready
- **All Gemini endpoints** - No local Mistral fallbacks needed (except Concept Graph hybrid)
- **Frontend-only effort** - Focus on UI/UX components
- **Existing patterns** - Use established patterns from completed features

---

**Created:** February 20, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation
