from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from Services.pdfsummary import extract_text_from_pdf
from Services.chapterwisesum import split_into_chapters_smart
from Services.groq_service import generate_summary as groq_generate_summary
from datetime import datetime
import os
from config.db import pdfconn
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import partial

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

pdf_summary_combined = APIRouter()

# --- Upload folder ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@pdf_summary_combined.post("/summarize-pdf-combined/")
async def summarize_pdf_combined(file: UploadFile = File(...), user_id: str = "ahsan", request: Request = None):
    """
    Receive a PDF, save permanently, store metadata, and generate a combined summary
    (General Summary + Chapter-wise Summary) using Groq.
    """
    logger.info(f"[1/7] PDF upload started for user: {user_id}, file: {file.filename}")
    
    # Log request details for debugging
    if request:
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"Request headers: {dict(request.headers)}")

    if not file.filename.lower().endswith(".pdf"): #type: ignore
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # 1️⃣ Save PDF permanently
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = file.filename.replace(" ", "_")#type: ignore
    saved_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

    try:
        logger.info(f"[2/7] Saving PDF to: {saved_path}")
        content = await file.read()
        with open(saved_path, "wb") as f:
            f.write(content)
        logger.info(f"[3/7] PDF saved successfully ({len(content)} bytes)")
    except Exception as e:
        logger.error(f"[ERROR] Failed to save file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # 2️⃣ Store metadata in MongoDB
    try:
        doc = {
            "user_id": user_id,
            "original_name": file.filename,
            "saved_path": saved_path,
            "upload_time": datetime.utcnow(),
        }
        pdfconn.insert_one(doc)
        logger.info(f"[4/7] Metadata stored in MongoDB")
    except Exception as e:
        logger.error(f"[ERROR] Failed to store metadata: {str(e)}")

    # 3️⃣ Extract text from PDF
    try:
        logger.info(f"[5/7] Extracting text from PDF...")
        pdf_text = extract_text_from_pdf(saved_path)
        if not pdf_text:
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF.")
        logger.info(f"[6/7] Text extracted successfully ({len(pdf_text)} characters)")
    except Exception as e:
        logger.error(f"[ERROR] Failed to extract text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    # 4️⃣ Generate General Summary using Groq
    general_summary_text = pdf_text[:15000]
    
    try:
        logger.info(f"[7/7] Generating general summary (first 15000 chars)...")
        # Run in executor to avoid blocking
        loop = asyncio.get_event_loop()
        general_summary = await loop.run_in_executor(
            executor,
            partial(groq_generate_summary, text=general_summary_text, context="Provide a comprehensive overview of the entire document", max_tokens=1500)
        )
        logger.info(f"[7/7] General summary generated ({len(general_summary)} chars)")
    except Exception as e:
        logger.error(f"[ERROR] Failed to generate general summary: {str(e)}")
        general_summary = f"Error generating general summary: {str(e)}"

    # 5️⃣ Split into chapters and generate chapter-wise summaries
    try:
        logger.info(f"[8/7] Splitting into chapters...")
        chapters = split_into_chapters_smart(pdf_text)
        logger.info(f"[8/7] Found {len(chapters)} chapters")
    except Exception as e:
        logger.error(f"[ERROR] Failed to split chapters: {str(e)}")
        chapters = []

    chapter_summaries = {}
    loop = asyncio.get_event_loop()
    
    for idx, (title, content) in enumerate(chapters):
        content_snippet = content[:10000]
        try:
            logger.info(f"[9/7] Generating summary for chapter {idx+1}/{len(chapters)}: {title}")
            chapter_summary = await loop.run_in_executor(
                executor,
                groq_generate_summary,
                content_snippet,
                f"Summarize this section: {title}. Maintain the context of the overall document.",
                800
            )
            chapter_summaries[title] = chapter_summary
            logger.info(f"[9/7] Chapter {idx+1} summary generated ({len(chapter_summary)} chars)")
        except Exception as e:
            logger.error(f"[ERROR] Failed to summarize chapter '{title}': {str(e)}")
            chapter_summaries[title] = f"Error generating summary for this section: {str(e)}"

    # 6️⃣ Compile the final response string as requested
    logger.info(f"[10/7] Compiling final response...")
    combined_response_text = f"# Summary\n\n{general_summary}\n\n"
    combined_response_text += "## Chapter-wise / Section-wise Summary\n\n"
    
    for title, summary in chapter_summaries.items():
        combined_response_text += f"### {title}\n\n{summary}\n\n"

    # 7️⃣ Return combined result + file info
    logger.info(f"[11/7] Request completed successfully")
    return {
        "file_info": {
            "filename": file.filename,
            "saved_path": saved_path,
        },
        "summary": combined_response_text,
        "combined_summary": combined_response_text,
        "combined_response_text": combined_response_text,
        "structured_data": {
            "general_summary": general_summary,
            "chapters": chapter_summaries
        }
    }

