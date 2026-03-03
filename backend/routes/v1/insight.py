from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from Services.pdfsummary import extract_text_from_pdf
from Services.groq_service import generate_concept_graph as groq_generate_concept_graph
import os
import json
import tempfile
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

insight_router = APIRouter()

@insight_router.post("/concept-graph/")
async def generate_concept_graph(
    file: UploadFile = File(...),
    use_api: bool = Form(default=True),
    max_concepts: int = Form(default=15)
):
    """
    Generate a concept graph from a PDF using Groq.
    Returns nodes (concepts/entities) and links (relationships) for visualization.
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
        
        # Generate concept graph using Groq (run in executor to avoid blocking)
        logger.info(f"Generating concept graph from PDF: {file.filename}")
        loop = asyncio.get_event_loop()
        graph = await loop.run_in_executor(
            executor,
            partial(groq_generate_concept_graph, text=pdf_text, max_concepts=max_concepts)
        )
        logger.info(f"Concept graph generated")
        
        return {
            "pdf_name": file.filename,
            "engine": "Groq API",
            "graph": graph
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)

