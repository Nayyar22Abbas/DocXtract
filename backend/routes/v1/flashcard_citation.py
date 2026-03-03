from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from Services.pdfsummary import extract_text_from_pdf
from Services.groq_service import generate_flashcards as groq_generate_flashcards
from datetime import datetime
import os
import json
import tempfile
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

flashcard_citation_router = APIRouter()

@flashcard_citation_router.post("/generate-flashcards/")
async def generate_flashcards_with_citation(
    file: UploadFile = File(...),
    max_cards: int = Form(default=10)
):
    """
    Generate flashcards with source citations from a PDF using Groq.
    Each flashcard includes the exact text from the PDF that supports the answer.
    """
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        pdf_path = tmp.name
    
    try:
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(pdf_path)
        if not pdf_text or len(pdf_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from PDF")
        
        # Generate flashcards using Groq (run in executor to avoid blocking)
        logger.info(f"Generating flashcards from PDF: {file.filename}")
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            partial(groq_generate_flashcards, text=pdf_text, num_cards=max_cards)
        )
        flashcards = result.get("flashcards", []) if result else []
        logger.info(f"Generated {len(flashcards)} flashcards")
        
        return {
            "model": "Groq-Llama",
            "total_flashcards": len(flashcards),
            "flashcards": flashcards
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)

