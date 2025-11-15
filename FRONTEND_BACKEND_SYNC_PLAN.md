# Frontend–Backend Sync Plan

This document describes **concrete steps** to update the Next.js frontend so it fully integrates with the existing FastAPI backend documented in `API_DOCUMENTATION_UPDATED.md`.

> Notes:
> - The deployed backend base URL is the **single source of truth**: `http://34.228.38.213:8000`.
> - We **will not use** `localhost:8000` for API calls in the frontend.
> - In the Document Processing page, it’s okay to have **extra cards**, but we **must not miss any card** required to cover a backend feature, and existing dummy cards need real behavior.

---

## 1. Environment & API Base URL

**Goal:** Make all API calls use the deployed FastAPI backend.

1. Create/update `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://34.228.38.213:8000
   ```
   - **Status:** ⏳ _To be set in your local/project environment_
2. In all frontend API helper files, read the base URL from this env variable **without falling back to localhost**:
   ```ts
   const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string | undefined) ?? 'http://34.228.38.213:8000';
   // Uses the deployed URL as a safe default when env is not set (no localhost fallback)
   ```
   - **Status:** ✅ Implemented in `frontend/lib/api/auth.ts`
3. Remove any hardcoded `http://localhost:8000` references from the frontend code and docs.
   - **Status:** ⏳ _To be fully cleaned up across the repo_

---

## 2. Authentication – Replace NextAuth + Dummy Credentials with FastAPI JWT

**Goal:** Use FastAPI endpoints `/authuser/signup` and `/authuser/login` with JWT stored in `localStorage`.

### 2.1 Replace `lib/api/auth.ts`

**Current:**
- Uses NextAuth (`signIn`, `signOut`).
- Validates against hardcoded dummy credentials.
- `signup()` is disabled.

**Target:**
- Direct `fetch` to FastAPI.
- Map frontend `email` → backend `username`.
- Store JWT token in `localStorage` (e.g., key `dx_access_token`).

**Status:** ✅ Implemented

**Steps:**

1. Remove the dummy credential logic and NextAuth usage from `frontend/lib/api/auth.ts`.
2. Implement:
   - `login(credentials)` → `POST /authuser/login`.
   - `signup(credentials)` → `POST /authuser/signup`, then auto-login.
   - `getToken()` → returns token from `localStorage`.
   - `isAuthenticated()` → returns `!!getToken()`.
   - `authHeaders()` → returns `{ Authorization: 'Bearer <token>' }` (or `{}` if no token).
   - `clearAuth()` → removes token from `localStorage`.
3. Use `API_BASE` from section 1 for all URLs, e.g.:
   - `fetch(
       `${API_BASE}/authuser/login`,
       { ... }
     )`.

### 2.2 Replace `lib/providers/auth-provider.tsx`

**Current:**
- Wraps app in `SessionProvider` (NextAuth).
- Derives `isAuthenticated` and `username` from `useSession()`.

**Target:**
- Custom React context managing auth state based on JWT in `localStorage`.

**Status:** ✅ Implemented

**Steps:**

1. Remove `SessionProvider`, `useSession`, and `signOut` imports.
2. Implement `AuthProvider` that:
   - On mount, reads token from `localStorage` and sets `isAuthenticated`.
   - Optionally decodes JWT to get `username` from the `sub` claim, or stores email/username separately at login time.
   - Provides:
     - `isAuthenticated: boolean`.
     - `username?: string`.
     - `logout(): void` → clears token and auth state.
3. Ensure `AuthProvider` wraps the app in `frontend/app/layout.tsx` (or equivalent root layout).

### 2.3 Update Login & Signup Pages

**Goal:** Use new auth API and redirect on success.

**Status:** ✅ Implemented (login + signup now use FastAPI and redirect to `/dashboard` on success)

**Steps:**

1. In login page (e.g. `frontend/app/(auth)/login/page.tsx`):
   - Call `login({ email, password })` from `lib/api/auth`.
   - Handle errors (show messages if backend returns non-200 with `detail`).
   - On success, redirect to `/dashboard`.
2. In signup page (e.g. `frontend/app/(auth)/signup/page.tsx`):
   - Call `signup({ name, email, password, confirmPassword })`.
   - Map `email` → `username` internally.
   - On success, redirect to `/dashboard`.

### 2.4 Protect Authenticated Routes

**Goal:** Prevent unauthenticated users from accessing dashboard and document-processing pages.

**Status:** ✅ Implemented (dashboard layout + navbar react to `useAuth()`)

**Steps:**

1. In `frontend/app/dashboard/layout.tsx` or `page.tsx`:
   - Use `useAuth()` to check `isAuthenticated` in a `useEffect`.
   - If `false`, redirect to `/login` using `useRouter()`.
2. Apply similar logic to nested routes under `/dashboard` if necessary (e.g., `/dashboard/document-processing`, `/dashboard/document-processing/*`).
3. Update Navbar (if present) to show:
   - "Login/Signup" when not authenticated.
   - Username and "Logout" when authenticated (calling `logout()` from `useAuth`).

---

## 3. Document Management – Move from Local Storage Only to Backend-Backed

**Goal:** Store uploaded PDFs in backend (Mongo + `uploads/`) and list them with backend endpoints.

### 3.1 Decide on User Identifier

The backend uses a `user_id` string for PDF operations and JWT `sub` for auth.

**Plan:**
- Use the same value (e.g., user email or username) for `user_id`.
- When logged in, extract `username`/email from JWT or from stored auth state and use that as `user_id`.

### 3.2 Update `DocumentProvider` to Use Backend Data

**Current:**
- `frontend/lib/providers/document-provider.tsx` stores documents only in `localStorage` with generated IDs.

**Target:**
- Fetch and store documents from backend via `/list/list-pdfs/{user_id}`.
- Use Mongo `_id` as `id` in the frontend.

**Steps:**

1. Adjust `StoredDocument` type to align with backend response:
   - `id: string` (Mongo `_id`).
   - `name` → `original_name` from backend.
   - `uploadDate` → `upload_time` from backend.
   - Optionally keep `size` and `type` as UI-only fields if needed.
2. On provider mount (when user is authenticated):
   - Read `user_id` from `useAuth()`.
   - Call `GET ${API_BASE}/list/list-pdfs/{user_id}`.
   - Set `documents` state from `data.documents`.
3. Refactor `addDocument(file: File)`:
   - Instead of generating a local ID and using `localStorage`, send the file to the backend (see 4.1).
   - After successful upload, either:
     - Refresh list from `/list/list-pdfs/{user_id}`, or
     - Use the response (if backend returns the inserted document ID) to append to `documents`.
   - Change return type to `Promise<boolean>` or `Promise<void>` to reflect async behavior.
4. For now, consider `deleteDocument(id)` frontend-only, or add a new backend delete endpoint later and wire to it.

### 3.3 Update Components Using Document Context

1. `frontend/app/dashboard/page.tsx`:
   - Update `handleFileSelected` to `await addDocument(file)` and handle async errors.
   - After successful upload, redirect to `/dashboard/document-processing`.
2. `frontend/app/dashboard/document-processing/page.tsx`:
   - Ensure `documents` come from backend via `DocumentProvider`.
   - Selection/deletion logic can remain, but deletion is local until backend supports deletion.
3. `frontend/components/document-list.tsx`:
   - Use backend fields (`original_name`, `upload_time`).
   - Adjust date formatting as needed.

---

## 4. PDF Upload & Processing – Wire to Backend Endpoints

**Goal:** When a user uploads a document or clicks a processing card, the frontend calls the relevant FastAPI endpoint.

### 4.1 Upload & Full Summary (`/summary/summarize-pdf/`)

**Endpoint:** `POST /summary/summarize-pdf/`

**Steps:**

1. In `DocumentProvider.addDocument` or `DashboardPage.handleFileSelected`:
   - Create `FormData` and append:
     - `file`: the selected PDF.
     - `user_id`: from `useAuth()`.
   - Call:
     - `fetch(`${API_BASE}/summary/summarize-pdf/`, { method: 'POST', body: formData })`.
2. Parse the response:
   - Contains `summary` and `file_info`.
   - Optionally store the summary in a dedicated context (e.g., `SummaryContext`) keyed by document ID.
3. After success:
   - Refresh documents list from `/list/list-pdfs/{user_id}`.
   - Navigate to `/dashboard/document-processing` or a dedicated summary page.

> **Optional backend enhancement:** Modify backend to return `id` (Mongo `_id`) in this response so the frontend can map the new document directly.

### 4.2 Chapter-wise Summary (`/chaptersum/summarize-pdf-chapters/`)

**Endpoint:** `POST /chaptersum/summarize-pdf-chapters/`

**Steps:**

1. Decide where in the UI this action lives (e.g., a "Chapter-wise Summary" card in Document Processing).
2. On card click for a given document:
   - If you still have the original `File`, send it as FormData like full summary.
   - Better: add a backend endpoint to summarize an existing uploaded PDF by `pdf_id`, then call that from the card.
3. Render the returned `chapter_summaries` in a dedicated page or section.

### 4.3 Chat with PDF (`/pdfchat/chat-pdf/{pdf_id}`) – Card & UI

**Endpoint:** `POST /pdfchat/chat-pdf/{pdf_id}`

**Steps:**

1. Ensure each `StoredDocument` includes its backend `id` (Mongo `_id`).
2. In the Document Processing page, ensure there is a **card for "Chat with PDF"** (QA) that:
   - Only enables when exactly one document is selected.
   - Navigates to `/dashboard/document-processing/qa?doc=<pdf_id>`.
3. In the QA/chat page (`frontend/app/dashboard/document-processing/qa/page.tsx`):
   - Read `doc` from search params.
   - Build a simple chat UI with:
     - Text input for question.
     - Chat history list.
   - On send:
     - Call `POST ${API_BASE}/pdfchat/chat-pdf/${pdfId}` with body `{ question: '...' }`.
     - Append `data.answer` to chat history.

### 4.4 Download PDF (`/pdfdownload/download-pdf/{pdf_id}`) – Card/Action

**Endpoint:** `GET /pdfdownload/download-pdf/{pdf_id}`

**Steps:**

1. Ensure there is a **"Download PDF"** card or action (e.g., card in Document Processing or button in `DocumentList`).
2. On click with a selected document:
   - Call `fetch(`${API_BASE}/pdfdownload/download-pdf/${pdfId}`)`.
   - Convert to blob and trigger download in the browser.
3. Optionally, open the PDF in a new tab using `window.open` with a direct URL to the endpoint.

---

## 5. Document Processing Cards – Ensure Coverage for All Backend Features

**Goal:** The Document Processing tab should have **at least one card** for each backend capability, and each card should have real behavior.

From `API_DOCUMENTATION_UPDATED.md`, we have these main PDF features:

1. **Full PDF Summary** → `/summary/summarize-pdf/`
2. **Chapter-wise Summary** → `/chaptersum/summarize-pdf-chapters/`
3. **Chat with PDF** → `/pdfchat/chat-pdf/{pdf_id}`
4. **List PDFs** → `/list/list-pdfs/{user_id}` (already used by `DocumentProvider`)
5. **Download PDF** → `/pdfdownload/download-pdf/{pdf_id}`

**Steps:**

1. Review `frontend/components/process-cards.tsx` and all pages under `frontend/app/dashboard/document-processing/*`.
2. Ensure there are cards that explicitly map to:
   - "Summarize Document" (Full summary).
   - "Chapter-wise Summary".
   - "Chat with Document" or "Ask Questions".
   - "Download Document" (if not already present, add one).
3. Extra cards (e.g., "Concepts", "Insights", "Comparison", "Citation") are allowed:
   - For now, they may reuse the same backend summaries or chat responses.
   - Over time, you can create specialized prompts or additional backend endpoints.
4. Replace all **dummy text** on these cards and pages with real behavior:
   - For example, the Summarize page currently says "frontend-only demo"; update it to actually load and display the summary from the corresponding backend call.

---

## 6. Content Generation (`/users/userprompt`)

**Endpoint:** `POST /users/userprompt`

**Goal:** Use the backend AI content generation for generic prompts.

**Steps:**

1. Create `frontend/lib/api/content.ts` with a function like `generateContent(prompt: string)` that:
   - Sends `FormData` or URL-encoded body to `${API_BASE}/users/userprompt`.
   - Returns the `response` HTML string.
2. Add a new card in the Document Processing area or dashboard for "Custom Content Generation" that navigates to a page using this API.
3. In that page, render the returned HTML using `dangerouslySetInnerHTML` with proper sanitization or trust boundary.

---

## 7. Route Protection, Error Handling & Token Usage

**Goal:** Make the app robust and aligned with backend behavior.

**Steps:**

1. Wrap all `fetch` calls in small helper functions that:
   - Check `response.ok`.
   - Parse JSON error body and throw `Error` with `detail` when available.
2. In UI components, catch these errors and display user-friendly messages (e.g., via toast component).
3. For protected endpoints (like `/protected_route/protected` or any future protected routes):
   - Always include `authHeaders()`.
   - On 401/403, clear auth and redirect to `/login`.

---

## 8. Cleanup & Consistency

**Steps:**

1. Remove or refactor any remaining NextAuth-specific code:
   - The NextAuth route under `frontend/app/api/auth/[...nextauth]/` can be removed once not used.
   - Remove `next-auth` and related packages from `frontend/package.json` after confirming they are unused.
2. Ensure **no hardcoded `localhost:8000` URLs** remain in the frontend.
3. Update `frontend/README.md` to:
   - Describe that authentication is now handled via FastAPI JWT.
   - Document required environment variables (`NEXT_PUBLIC_API_URL`).
4. Optionally add a short section describing the mapping between Document Processing cards and backend endpoints for future contributors.

---

## 9. Suggested Implementation Order

1. **Set up env & API base URL** (Section 1) and remove any localhost URLs.
2. **Implement auth API + AuthProvider and update login/signup** (Section 2).
3. **Refactor DocumentProvider to load from `/list/list-pdfs/{user_id}`** (Section 3).
4. **Wire upload flow to `/summary/summarize-pdf/`** and ensure a corresponding "Summarize" card works end-to-end (Sections 4.1 & 5).
5. **Implement Chapter-wise Summary and Chat with PDF flows**, making sure there are cards for each (Sections 4.2–4.3 & 5).
6. **Add Download card/action and integrate `/pdfdownload/download-pdf/{pdf_id}`** (Section 4.4).
7. **Add content generation feature using `/users/userprompt`**, optionally with its own card (Section 6).
8. **Complete cleanup, error handling, and documentation updates** (Sections 7–8).

Following these steps will align the frontend with the deployed FastAPI backend, ensure all backend features are reachable via cards in the Document Processing area, and remove reliance on localhost URLs.
