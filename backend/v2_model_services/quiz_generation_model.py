import json
import re
from routes.v2.model_load import llm
from v2_model_services.Pdf_plumber_text_extraction import extract_text_from_pdf
from v2_model_services.text_chunking import chunk_text
from v2_model_services.embeddding_faiss_index import build_index, retrieve

async def generate_quiz_mistral(pdf_path: str, document_type: str = "Research Paper"):
    """
    Generates a quiz using Mistral and RAG based on the provided PDF.
    """
    # 1. Extract text
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return None

    # 2. Chunk text
    chunks = chunk_text(text, chunk_size=600, overlap=100)
    
    # 3. Build index
    index, _ = build_index(chunks)
    
    # 4. Retrieve context for quiz generation
    # We want a broad coverage, so we query for the main concepts and relationships
    query = "The main concepts, section relationships, and critical reasoning details of the document for educational assessment."
    context = retrieve(query, chunks, index)

    # 5. Mistral Prompt
    prompt = f"""
[INST] You are DocXtract Academia, an expert educational assessment generator.
Your task is to generate a comprehension-focused quiz STRICTLY based on the provided context.
Do not introduce information that is not present in the document.

--------------------------------------------------
RULES & CONSTRAINTS
--------------------------------------------------
- Use clear, academic language suitable for university students
- Focus on understanding, analysis, and application
- Avoid trivial or purely factual recall
- Questions must be answerable using ONLY the provided context
- Return EXACTLY 10 questions total (6 MCQs, 2 Short Answer, 2 True/False)

--------------------------------------------------
MCQ RULES
--------------------------------------------------
- Exactly 4 options per MCQ. Only ONE correct answer.
- Shuffle correct answer positions.

--------------------------------------------------
OUTPUT FORMAT (STRICT JSON)
--------------------------------------------------
Return the response in the following JSON structure ONLY. Do not include any other text.

{{
  "document_type": "{document_type}",
  "quiz": {{
    "mcqs": [
      {{
        "question": "",
        "options": {{ "A": "", "B": "", "C": "", "D": "" }},
        "correct_answer": "A | B | C | D",
        "difficulty": "Easy | Medium | Hard",
        "explanation": ""
      }}
    ],
    "short_answer": [
      {{
        "question": "",
        "sample_answer": "",
        "difficulty": "Medium | Hard"
      }}
    ],
    "true_false": [
      {{
        "statement": "",
        "correct_answer": true,
        "justification": ""
      }}
    ]
  }}
}}

--------------------------------------------------
CONTEXT
--------------------------------------------------
{context}
[/INST]"""

    try:
        # 0.2 temperature is ideal for factual quizzes to prevent hallucinations.
        output = llm(prompt, max_tokens=1024, temperature=0.2)
        response_text = output["choices"][0]["text"]
        
        # Extract JSON from the response
        match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if match:
            json_str = match.group()
            return json.loads(json_str)
        else:
            print(f"Mistral response did not contain JSON: {response_text}")
            return None
    except Exception as e:
        print(f"Error in generate_quiz_mistral: {e}")
        return None
