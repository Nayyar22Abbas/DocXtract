from fastapi import FastAPI, Form, UploadFile, File, APIRouter
import shutil
import os
import pdfplumber
from routes.v2.model_load import llm

flashcardWithcitation = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- PDF Extraction with line numbers ---
def extract_text_with_lines(path):
    """
    Extracts text from the first 3 pages of a PDF.
    Returns a list of dicts with page, line_number, and text.
    """
    lines = []
    with pdfplumber.open(path) as pdf:
        for page_num, page in enumerate(pdf.pages[:3], start=1):
            page_text = page.extract_text()
            if page_text:
                for idx, line in enumerate(page_text.splitlines(), start=1):
                    if line.strip():
                        lines.append({
                            "page": page_num,
                            "line_number": idx,
                            "text": line.strip()
                        })
    return lines

# --- Generate flashcards using LLM ---
def generate_flashcards(lines, max_cards):
    """
    Send numbered lines to LLM and ask it to generate flashcards.
    """
    numbered_text = "\n".join([f"{i['line_number']}|||{i['text']}" for i in lines])
   
    prompt = f"""
You are an intelligent AI tutor.

Extract {max_cards} important concepts from the text below and
convert each into a flashcard in this format:

Q: <question>
A: <concise answer>
Source Line: <line number>

TEXT:
{numbered_text}
"""
    output = llm(prompt, max_tokens=600)  # increase max_tokens for longer PDFs
    raw_text = output["choices"][0]["text"]  # type: ignore
    return parse_flashcards_with_source(raw_text)

# --- Parse flashcards ---
def parse_flashcards_with_source(output):
    """
    Parses LLM output into structured flashcards with difficulty and source line.
    """
    cards = []
    blocks = output.split("Q:")

    for block in blocks[1:]:
        try:
            q, rest = block.split("A:")
            a, source = rest.split("Source Line:")
            
            question = q.strip()
            answer = a.strip()
            line_num = int(source.strip())

            # Difficulty logic
            if len(answer.split()) <= 8:
                difficulty = "Easy"
            elif len(answer.split()) <= 20:
                difficulty = "Medium"
            else:
                difficulty = "Hard"

            cards.append({
                "question": question,
                "answer": answer,
                "difficulty": difficulty,
                "source_line": line_num
            })
        except Exception:
            continue

    return cards

# --- API Endpoint ---
@flashcardWithcitation.post("/generate-flashcards/")
async def generate_flashcards_api(
    file: UploadFile = File(...),
    max_cards: int = Form(...)
):
    """
    Upload a PDF and get AI-generated flashcards with source lines.
    """
    # Save uploaded PDF
    path = f"{UPLOAD_DIR}/{file.filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text with line numbers
    lines = extract_text_with_lines(path)
    if not lines:
        return {"error": "No readable text found in PDF. Is it scanned?"}

    # Generate flashcards
    flashcards = generate_flashcards(lines, max_cards=max_cards)

    return {
        "model": "Mistral-7B (via llm callable)",
        "total_flashcards": len(flashcards),
        "flashcards": flashcards
    }

# --- Optional: Integrate Router with FastAPI App ---
# app = FastAPI()
# app.include_router(flashcard, prefix="/flashcard")
