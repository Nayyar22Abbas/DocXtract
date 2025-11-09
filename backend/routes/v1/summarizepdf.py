from fastapi import APIRouter, UploadFile, File
from Services.pdfsummary import extract_text_from_pdf
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from Services.pdfsummary import extract_text_from_pdf
import os
from datetime import datetime
import google.generativeai as genai
from config.db import pdfconn



import google.generativeai as genai

pdfsum=APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@pdfsum.post("/summarize-pdf/")
async def summarize_pdf(file: UploadFile = File(...), user_id: str = "ahsan"):
    """Receive a PDF, save permanently, log metadata in MongoDB Atlas, and summarize."""
    
    if not file.filename.lower().endswith(".pdf"): #type: ignore
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save PDF permanently
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = file.filename.replace(" ", "_")#type: ignore
    saved_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

    with open(saved_path, "wb") as f:
        f.write(await file.read())

    # Save metadata in MongoDB Atlas
    doc = {
        "user_id": user_id,
        "original_name": file.filename,
        "saved_path": saved_path,
        "upload_time": datetime.utcnow()
    }
    pdfconn.insert_one(doc)

    # Extract text
    pdf_text = extract_text_from_pdf(saved_path)
    pdf_text = pdf_text[:15000]  # Gemini limit

    # Generate summary
    model = genai.GenerativeModel(model_name="gemini-2.0-flash") # type: ignore
    prompt = f"Summarize the following PDF content in clear and concise paragraphs:\n\n{pdf_text}"
    response = model.generate_content(prompt)

    return {
        "summary": response.text,
        "file_info": {
            "filename": file.filename,
            "saved_path": saved_path,
        },
    }
