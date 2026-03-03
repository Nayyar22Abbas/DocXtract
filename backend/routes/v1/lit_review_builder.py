from fastapi import APIRouter, UploadFile, File, HTTPException
from Services.pdfsummary import extract_text_from_pdf
from Services.groq_service import generate_content as groq_generate_content
from datetime import datetime
import os
from typing import List
from config.db import pdfconn
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

lit_review_router = APIRouter()

# --- Upload folder ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@lit_review_router.post("/generate-lit-review/")
async def generate_lit_review(files: List[UploadFile] = File(...), user_id: str = "ahsan"):
    """
    Receive multiple PDFs, save them, store metadata, and generate a synthesized literature review
    including themes, gaps, and future work using Groq.
    """
    
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    all_file_info = []
    combined_text = ""

    for file in files:
        if not file.filename.lower().endswith(".pdf"): #type: ignore
            continue # Skip non-pdf files
            
        # 1️⃣ Save PDF permanently
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_filename = file.filename.replace(" ", "_")#type: ignore
        saved_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

        try:
            content = await file.read()
            with open(saved_path, "wb") as f:
                f.write(content)
        except Exception as e:
            continue # Or handle as needed

        # 2️⃣ Store metadata in MongoDB
        doc = {
            "user_id": user_id,
            "original_name": file.filename,
            "saved_path": saved_path,
            "upload_time": datetime.utcnow(),
            "type": "literature_review_input"
        }
        pdfconn.insert_one(doc)

        # 3️⃣ Extract text from PDF
        pdf_text = extract_text_from_pdf(saved_path)
        if pdf_text:
            combined_text += f"\n\n--- Paper: {file.filename} ---\n\n" + pdf_text[:10000] # Truncate per paper to fit context
            
        all_file_info.append({
            "filename": file.filename,
            "saved_path": saved_path
        })

    if not combined_text:
        raise HTTPException(status_code=400, detail="No readable text found in the uploaded PDFs.")

    # 4️⃣ Generate Literature Review Synthesis using Groq
    prompt = f"""
    You are an academic research assistant. Based on the following extracted text from multiple research papers, provide a comprehensive literature review synthesis.
    
    Your response should include:
    1. **Thematic Analysis**: Identify and discuss major themes and trends across all papers.
    2. **Synthesis of Papers**: Briefly synthesize how each paper contributes to these themes.
    3. **Research Gaps**: Identify clear gaps in the current research presented.
    4. **Future Work**: Suggest specific directions for future research based on these gaps.
    
    Format the output with clear Markdown headings.
    
    Extracted Text:
    {combined_text}
    """
    
    try:
        logger.info(f"Generating literature review from {len(all_file_info)} papers")
        loop = asyncio.get_event_loop()
        lit_review_result = await loop.run_in_executor(
            executor,
            partial(groq_generate_content, prompt=prompt, max_tokens=8000)
        )
        logger.info(f"Literature review generated ({len(lit_review_result)} chars)")
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error generating literature review: {error_msg}")
        lit_review_result = f"Error generating literature review: {error_msg}"

    # 5️⃣ Return result + file info
    return {
        "files_processed": all_file_info,
        "literature_review": lit_review_result
    }

