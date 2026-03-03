from fastapi import APIRouter, HTTPException, Body
from bson import ObjectId
from Services.pdfsummary import extract_text_from_pdf
from Services.groq_service import generate_content as groq_generate_content
import os
from pymongo import MongoClient
from config.db import pdfconn
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)
pdfchat = APIRouter()

# MongoDB connection


@pdfchat.post("/chat-pdf/{pdf_id}")
async def chat_with_pdf(pdf_id: str, request_body: dict = Body(...)):
    """
    Chat with a specific PDF using Groq.
    Expects: {"question": "your question here"}
    """
    
    question = request_body.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question field is required")
    
    doc = pdfconn.find_one({"_id": ObjectId(pdf_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="PDF not found")

    file_path = doc["saved_path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

   
    pdf_text = extract_text_from_pdf(file_path)
    pdf_text = pdf_text[:15000]
    
    prompt = f"You are an AI assistant. Answer the following question based on the PDF content.\n\nPDF Content:\n{pdf_text}\n\nQuestion:\n{question}"
    
    logger.info(f"Answering question for PDF: {pdf_id}")
    loop = asyncio.get_event_loop()
    answer = await loop.run_in_executor(
        executor,
        partial(groq_generate_content, prompt=prompt)
    )
    logger.info(f"Answer generated")

    return {"answer": answer}

