from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import shutil
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

from routes.v2.model_load import llm
from v2_model_services.Pdf_plumber_text_extraction import extract_text_from_pdf

load_dotenv()

insight_router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configure Gemini
API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def clean_json_response(raw_text):
    """
    Cleans LLM response to ensure it's valid JSON.
    Removes markdown code blocks if present.
    """
    clean_text = re.sub(r"```json\s*|\s*```", "", raw_text).strip()
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        # Fallback: find something that looks like a JSON object
        json_match = re.search(r"\{.*\}", clean_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except:
                pass
        return {"error": "Invalid JSON format from LLM", "raw": raw_text}

@insight_router.post("/concept-graph/")
async def generate_concept_graph(
    file: UploadFile = File(...),
    use_api: bool = Form(False),
    max_concepts: int = Form(10)
):
    """
    Upload a PDF and identify key concepts and relationships.
    Returns a graph-ready JSON (nodes and links).
    """
    # 1. Save file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Extract and Truncate text
    try:
        text = extract_text_from_pdf(file_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
        # Limit text size for the prompt
        truncated_text = text[:4000]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

    # 3. Construct Prompt
    prompt = f"""
    Analyze the following text and extract the top {max_concepts} most important concepts.
    For each concept, identify how it relates to other concepts mentioned in the text.
    
    Return the result strictly in this JSON format:
    {{
      "nodes": [
        {{"id": "node_id", "label": "Concept Name", "type": "topic/entity"}}
      ],
      "links": [
        {{"source": "node_id_1", "target": "node_id_2", "relation": "describes/part of/influences"}}
      ]
    }}
    
    TEXT:
    {truncated_text}
    """

    # 4. Model Execution
    try:
        if use_api:
            if not API_KEY:
                raise HTTPException(status_code=500, detail="Google API Key missing in environment.")
            
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            raw_response = response.text
        else:
            # Local Mistral
            output = llm(prompt, max_tokens=1000, temperature=0.1)
            raw_response = output["choices"][0]["text"] # type: ignore

        # 5. Parse and Return
        graph_data = clean_json_response(raw_response)
        return {
            "pdf_name": file.filename,
            "engine": "Gemini API" if use_api else "Local Mistral",
            "graph": graph_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM processing failed: {str(e)}")
