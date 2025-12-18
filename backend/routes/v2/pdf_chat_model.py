from fastapi import APIRouter, Body, HTTPException
from bson import ObjectId
import os

from config.db import pdfconn
from routes.v2.model_load import llm
from v2_model_services.Pdf_plumber_text_extraction import extract_text_from_pdf
from v2_model_services.text_chunking import chunk_text
from v2_model_services.modelcalling import ask_mistral
from v2_model_services.embeddding_faiss_index import build_index
from v2_model_services.retrieve_chunks import retrieve


modelpdfchat = APIRouter()
pdf_indices = {}  
@modelpdfchat.post("/chat-pdf/{pdf_id}")
def chat_with_pdf(pdf_id: str, question: str = Body(...)):
    """
    Chat with a specific PDF using a local LLM.
    """

    # 1️⃣ Find PDF record
    doc = pdfconn.find_one({"_id": ObjectId(pdf_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="PDF not found")

    # 2️⃣ Check file exists
    file_path = doc["saved_path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    # 3️⃣ Extract text from PDF
    pdf_text = extract_text_from_pdf(file_path)
    pdf_text = pdf_text[:5000]  # limit input size
    chunks = chunk_text(pdf_text)
    
    if pdf_id in pdf_indices:
        index = pdf_indices[pdf_id]
    else:
        index, _ = build_index(chunks)
        pdf_indices[pdf_id] = index  # cache it

    # Retrieve relevant chunks
    context = retrieve(question, chunks, index)
    print("Retrieved Context:", context)

    # Ask local LLM
    answer = ask_mistral(context, question)

    return {"answer": answer}

