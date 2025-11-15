# DOCxTRACT API Documentation

## Overview
This document provides complete API endpoint documentation for the DOCxTRACT backend (FastAPI). It includes all required request parameters, response formats, and how to use each endpoint from a Next.js frontend.

**Base URL**: `http://34.228.38.213:8000`

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Protected Routes](#protected-routes)
3. [Content Generation Endpoints](#content-generation-endpoints)
4. [PDF Summary Endpoints](#pdf-summary-endpoints)
5. [Chapter-wise Summary Endpoints](#chapter-wise-summary-endpoints)
6. [PDF Download Endpoints](#pdf-download-endpoints)
7. [PDF Chat Endpoints](#pdf-chat-endpoints)
8. [PDF List Endpoints](#pdf-list-endpoints)

---

## Authentication Endpoints

### 1. User Signup (Local Authentication)
**Endpoint**: `POST /authuser/signup`

**Purpose**: Create a new user account with username and password

**Frontend Request (Next.js)**:
```javascript
const response = await fetch('http://34.228.38.213:8000/authuser/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepassword123'
  })
});
const data = await response.json();
```

**Request Body**:
```json
{
  "username": "string (required, unique)",
  "password": "string (required, min 8 chars recommended)"
}
```

**Response (200 - Success)**:
```json
{
  "message": "User created successfully"
}
```

**Response (400 - Error)**:
```json
{
  "detail": "Username already exists"
}
```

---

### 2. User Login (Local Authentication)
**Endpoint**: `POST /authuser/login`

**Purpose**: Login with username and password to get JWT token

**Frontend Request (Next.js)**:
```javascript
const response = await fetch('http://34.228.38.213:8000/authuser/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'securepassword123'
  })
});
const data = await response.json();
// Store token: localStorage.setItem('access_token', data.access_token);
```

**Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 - Success)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Response (401 - Error)**:
```json
{
  "detail": "Invalid username or password"
}
```

**Response (403 - Error)**:
```json
{
  "detail": "usegoogle Login instead"
}
```

---

### 3. Google OAuth Login
**Endpoint**: `GET /authuser/login/google`

**Purpose**: Redirect user to Google login page

**Frontend Request (Next.js)**:
```javascript
// Redirect to backend
window.location.href = 'http://34.228.38.213:8000/authuser/login/google';
```

---

### 4. Google OAuth Callback
**Endpoint**: `GET /authuser/auth/google`

**Purpose**: Google OAuth callback endpoint (handled automatically by OAuth flow)

**Response (200 - Success)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 5. GitHub OAuth Login
**Endpoint**: `GET /authuser/login/github`

**Purpose**: Redirect user to GitHub login page

**Frontend Request (Next.js)**:
```javascript
// Redirect to backend
window.location.href = 'http://34.228.38.213:8000/authuser/login/github';
```

---

### 6. GitHub OAuth Callback
**Endpoint**: `GET /authuser/auth/github`

**Purpose**: GitHub OAuth callback endpoint (handled automatically by OAuth flow)

**Response (200 - Success)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Response (400 - Error)**:
```json
{
  "detail": "could not retrieve email from Github"
}
```

---

## Protected Routes

### 7. Protected Route (Authentication Required)
**Endpoint**: `GET /protected_route/protected`

**Purpose**: Access a protected route that requires valid JWT token

**Frontend Request (Next.js)**:
```javascript
const token = localStorage.getItem('access_token');
const response = await fetch('http://34.228.38.213:8000/protected_route/protected', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
const data = await response.json();
```

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Response (200 - Success)**:
```json
{
  "message": "Hello john_doe, you accessed a protected route!"
}
```

**Response (401 - Error)**:
```json
{
  "detail": "Not authenticated"
}
```

**Response (403 - Error)**:
```json
{
  "detail": "Invalid token"
}
```

---

## Content Generation Endpoints

### 8. Get Prompt Form (HTML)
**Endpoint**: `GET /users/userprompt`

**Purpose**: Retrieve the HTML form for user input

**Frontend Request (Next.js)**:
```javascript
// This returns HTML form - typically used for traditional form submission
// Not recommended for Next.js SPA
```

**Response**: HTML form page

---

### 9. Generate Content from Prompt
**Endpoint**: `POST /users/userprompt`

**Purpose**: Generate AI content based on user prompt

**Frontend Request (Next.js - FormData)**:
```javascript
const formData = new FormData();
formData.append('prompt', 'Write an introduction to machine learning');

const response = await fetch('http://34.228.38.213:8000/users/userprompt', {
  method: 'POST',
  body: formData  // No Content-Type header, browser will set it automatically
});
const data = await response.json();
```

**Frontend Request (Next.js - Alternative with URLSearchParams)**:
```javascript
const response = await fetch('http://34.228.38.213:8000/users/userprompt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'prompt=' + encodeURIComponent('Write an introduction to machine learning')
});
const data = await response.json();
```

**Request Parameters**:
- `prompt`: string (required) - The user prompt for content generation

**Response (200 - Success)**:
```json
{
  "response": "<html formatted markdown content>"
}
```

**Response Example**:
```json
{
  "response": "<h1>Introduction to Machine Learning</h1>\n<p>Machine learning is a subset of artificial intelligence...</p>"
}
```

---

## PDF Summary Endpoints

### 10. Summarize Full PDF
**Endpoint**: `POST /summary/summarize-pdf/`

**Purpose**: Upload a PDF and get a complete summary

**Frontend Request (Next.js - FormData)**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile); // pdfFile from <input type="file" />
formData.append('user_id', 'user123'); // Optional, defaults to "ahsan"

const response = await fetch('http://34.228.38.213:8000/summary/summarize-pdf/', {
  method: 'POST',
  body: formData  // No Content-Type header
});
const data = await response.json();
```

**Request Parameters**:
- `file`: File (required) - PDF file to summarize
- `user_id`: string (optional, default: "ahsan") - User identifier

**Request Headers**:
```
Content-Type: multipart/form-data
```

**Response (200 - Success)**:
```json
{
  "summary": "This document discusses the history and applications of artificial intelligence...",
  "file_info": {
    "filename": "document.pdf",
    "saved_path": "uploads/20231115_143022_document.pdf"
  }
}
```

**Response (400 - Error)**:
```json
{
  "detail": "Only PDF files are allowed"
}
```

---

## Chapter-wise Summary Endpoints

### 11. Summarize PDF by Chapters
**Endpoint**: `POST /chaptersum/summarize-pdf-chapters/`

**Purpose**: Upload a PDF and get summaries for each chapter

**Frontend Request (Next.js - FormData)**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile); // pdfFile from <input type="file" />
formData.append('user_id', 'user123'); // Optional, defaults to "ahsan"

const response = await fetch('http://34.228.38.213:8000/chaptersum/summarize-pdf-chapters/', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

**Request Parameters**:
- `file`: File (required) - PDF file to analyze
- `user_id`: string (optional, default: "ahsan") - User identifier

**Response (200 - Success)**:
```json
{
  "file_info": {
    "filename": "textbook.pdf",
    "saved_path": "uploads/20231115_143022_textbook.pdf"
  },
  "chapter_summaries": {
    "Chapter 1: Introduction": "This chapter introduces the fundamental concepts of...",
    "Chapter 2: Basic Concepts": "Building on the introduction, this chapter explores...",
    "Chapter 3: Advanced Topics": "This chapter delves deeper into advanced applications..."
  }
}
```

**Response (400 - Error)**:
```json
{
  "detail": "Only PDF files are allowed"
}
```

---

## PDF Download Endpoints

### 12. Download PDF by ID
**Endpoint**: `GET /pdfdownload/download-pdf/{pdf_id}`

**Purpose**: Download a previously uploaded PDF file

**Frontend Request (Next.js)**:
```javascript
const pdfId = '507f1f77bcf86cd799439011'; // From list-pdfs response
const response = await fetch(`http://34.228.38.213:8000/pdfdownload/download-pdf/${pdfId}`, {
  method: 'GET'
});

// Create a blob and trigger download
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'document.pdf';
link.click();
```

**URL Parameters**:
- `pdf_id`: string (required) - MongoDB ObjectId of the PDF

**Response (200 - Success)**:
- File download (binary PDF content)

**Response (404 - Error)**:
```json
{
  "detail": "PDF not found"
}
```

```json
{
  "detail": "File missing on server"
}
```

---

## PDF Chat Endpoints

### 13. Chat with PDF
**Endpoint**: `POST /pdfchat/chat-pdf/{pdf_id}`

**Purpose**: Ask questions about a specific PDF document

**Frontend Request (Next.js)**:
```javascript
const pdfId = '507f1f77bcf86cd799439011'; // From list-pdfs response
const question = 'What are the main findings in chapter 3?';

const response = await fetch(`http://34.228.38.213:8000/pdfchat/chat-pdf/${pdfId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: question
  })
});
const data = await response.json();
console.log(data.answer);
```

**URL Parameters**:
- `pdf_id`: string (required) - MongoDB ObjectId of the PDF

**Request Body**:
```json
{
  "question": "string (required) - Question about the PDF"
}
```

**Response (200 - Success)**:
```json
{
  "answer": "Based on the PDF content, the main findings in chapter 3 include..."
}
```

**Response (404 - Error)**:
```json
{
  "detail": "PDF not found"
}
```

```json
{
  "detail": "File missing on server"
}
```

---

## PDF List Endpoints

### 14. List User's PDFs
**Endpoint**: `GET /list/list-pdfs/{user_id}`

**Purpose**: Retrieve all PDFs uploaded by a specific user

**Frontend Request (Next.js)**:
```javascript
const userId = 'user123';
const response = await fetch(`http://34.228.38.213:8000/list/list-pdfs/${userId}`, {
  method: 'GET'
});
const data = await response.json();
// data.documents contains all PDFs for the user
```

**URL Parameters**:
- `user_id`: string (required) - User identifier

**Response (200 - Success)**:
```json
{
  "documents": [
    {
      "id": "507f1f77bcf86cd799439011",
      "original_name": "textbook.pdf",
      "saved_path": "uploads/20231115_143022_textbook.pdf",
      "upload_time": "2023-11-15T14:30:22.123000"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "original_name": "research_paper.pdf",
      "saved_path": "uploads/20231115_143522_research_paper.pdf",
      "upload_time": "2023-11-15T14:35:22.456000"
    }
  ]
}
```

**Response (200 - No Documents)**:
```json
{
  "documents": []
}
```

---

## Common HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (user not allowed) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

---

## Authentication Headers

All protected endpoints require the following header:

```
Authorization: Bearer <access_token>
```

Where `<access_token>` is the JWT token received from login/signup endpoints.

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js frontend)
- `http://localhost`

Make sure your Next.js frontend is running on `http://localhost:3000`.

---

## Next.js Frontend Integration Examples

### Store JWT Token After Login
```javascript
// pages/login.js
const handleLogin = async (username, password) => {
  const response = await fetch('http://34.228.38.213:8000/authuser/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  router.push('/dashboard');
};
```

### Use Token in Protected API Calls
```javascript
// lib/api.js
const getToken = () => localStorage.getItem('access_token');

export const fetchProtected = async (endpoint) => {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

### Upload PDF with FormData
```javascript
// components/PDFUploader.js
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', 'user123');
  
  const response = await fetch('http://34.228.38.213:8000/summary/summarize-pdf/', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log(data.summary);
};
```

---

## Error Handling in Next.js

```javascript
const handleRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API Error');
    }
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
};
```

---

## Environment Variables

Store these in your Next.js `.env.local`:

```
NEXT_PUBLIC_API_URL=http://34.228.38.213:8000
```

Then use in your code:

```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authuser/login`, {...})
```

---

## Running the Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn index:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://34.228.38.213:8000`
The API documentation (Swagger UI) will be at `http://34.228.38.213:8000/docs`

---

## Notes

- All timestamps are in UTC format
- PDF files are stored in the `uploads/` directory on the server
- JWT tokens are used for authentication and are recommended for security
- The `user_id` parameter is currently optional and defaults to "ahsan" for PDF operations
- Maximum PDF content for summarization is 15,000 characters (Gemini API limit)

---

**Last Updated**: November 11, 2025
