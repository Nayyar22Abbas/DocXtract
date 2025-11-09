from fastapi import APIRouter, UploadFile, File, HTTPException
from Services.pdfsummary import extract_text_from_pdf
from Services.chapterwisesum import split_into_chapters_smart
from datetime import datetime
from pymongo import MongoClient
import google.generativeai as genai
import os
from config.db import pdfconn

chapterwisesum = APIRouter()




# --- Upload folder ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@chapterwisesum.post("/summarize-pdf-chapters/")
async def summarize_pdf_chapters(file: UploadFile = File(...), user_id: str = "ahsan"):
    """
    Receive a PDF, save permanently, store metadata, and generate smart chapter-wise summaries.
    """

    if not file.filename.lower().endswith(".pdf"): #type: ignore
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # 1️⃣ Save PDF permanently
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = file.filename.replace(" ", "_")#type: ignore
    saved_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{safe_filename}")

    with open(saved_path, "wb") as f:
        f.write(await file.read())

    # 2️⃣ Store metadata in MongoDB
    doc = {
        "user_id": user_id,
        "original_name": file.filename,
        "saved_path": saved_path,
        "upload_time": datetime.utcnow(),
    }
    pdfconn.insert_one(doc)

    # 3️⃣ Extract text from PDF
    pdf_text = extract_text_from_pdf(saved_path)

    # 4️⃣ Split into chapters
    chapters = split_into_chapters_smart(pdf_text)

    # 5️⃣ Generate chapter-wise summaries using Gemini
    model = genai.GenerativeModel(model_name="gemini-2.5-flash")  # type: ignore
    summaries = {}

    for title, content in chapters:
        content = content[:15000]  # truncate for token limits
        prompt = f"Summarize the following chapter content in clear and concise paragraphs:\n\n{content}"
        response = model.generate_content(prompt)
        summaries[title] = response.text

    # 6️⃣ Return summaries + file info
    return {
        "file_info": {
            "filename": file.filename,
            "saved_path": saved_path,
        },
        "chapter_summaries": summaries
    }
