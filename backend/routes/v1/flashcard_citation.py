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
    max_cards: int = Form(default=10),
    user_id: str = Form(default="anonymous")
):
    """
    Generate flashcards with source citations from a PDF using Groq.
    Each flashcard includes the exact text from the PDF that supports the answer.
    """
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    logger.info(f"[1/5] Flashcard generation started for user: {user_id}, file: {file.filename}")
    
    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        pdf_path = tmp.name
    
    try:
        # Extract text from PDF
        logger.info(f"[2/5] Extracting text from PDF...")
        pdf_text = extract_text_from_pdf(pdf_path)
        if not pdf_text or len(pdf_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from PDF")
        
        logger.info(f"[3/5] Text extracted ({len(pdf_text)} characters), generating flashcards...")
        
        # Generate flashcards using Groq (run in executor to avoid blocking)
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            partial(groq_generate_flashcards, text=pdf_text, num_cards=max_cards)
        )
        
        # Transform response to match frontend expectations
        raw_flashcards = result.get("flashcards", []) if result else []
        logger.info(f"[4/5] Generated {len(raw_flashcards)} flashcards from Groq")
        
        # Convert from Groq format (front/back/topic) to frontend format (question/answer/citation/difficulty)
        transformed_flashcards = []
        for card in raw_flashcards:
            transformed_card = {
                "question": card.get("front", ""),
                "answer": card.get("back", ""),
                "citation": card.get("topic", ""),  # Use topic as citation/category
                "difficulty": "Medium",  # Default difficulty
                "source_text": None  # Will be added if we extract specific citations
            }
            # Remove None values
            transformed_card = {k: v for k, v in transformed_card.items() if v is not None}
            transformed_flashcards.append(transformed_card)
        
        logger.info(f"[5/5] Flashcards transformed and ready to send ({len(transformed_flashcards)} cards)")
        
        return {
            "model": "Groq-Llama",
            "total_flashcards": len(transformed_flashcards),
            "flashcards": transformed_flashcards
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ERROR] Flashcard generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Flashcard generation failed: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)

