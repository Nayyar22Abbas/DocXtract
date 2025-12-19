from fastapi import FastAPI, UploadFile, File, Form,APIRouter
from v2_model_services.Pdf_plumber_text_extraction import extract_text_from_pdf
from v2_model_services.text_chunking import chunk_text
from v2_model_services.mcq_generation.mcq_generation import generate_mcqs
import tempfile
import math
import json
mcqs=APIRouter()


@mcqs.post("/generate-mcqs/")
async def generate_mcqs_from_pdf(
    file: UploadFile = File(...),
    total_mcqs: int = Form(...)
):
    """
    total_mcqs is provided by frontend
    """

    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        pdf_path = tmp.name

    # Extract & chunk text
    text = extract_text_from_pdf(pdf_path)
    chunks = chunk_text(text)



      # Determine MCQs per chunk
    num_chunks = len(chunks)
    mcqs_per_chunk = math.ceil(total_mcqs / num_chunks)

    # Generate MCQs
    all_mcqs = []
    for chunk in chunks:
        mcqs_json = generate_mcqs(chunk, mcqs_per_chunk)
        try:
            mcqs_parsed = json.loads(mcqs_json)
            all_mcqs.extend(mcqs_parsed)
        except:
            # fallback: keep raw text if JSON parsing fails
            all_mcqs.append(mcqs_json)

    # Trim to total_mcqs requested
    all_mcqs = all_mcqs[:total_mcqs]

    return {
        "filename": file.filename,
        "requested_mcqs_per_chunk": mcqs_per_chunk,
        "total_chunks": len(chunks),
        "mcqs": all_mcqs
    }
