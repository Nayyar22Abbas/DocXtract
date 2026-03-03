"""
Groq API Service for DocXtract
Provides a wrapper for Groq API calls with lazy client initialization
"""

from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

# Lazy initialization of Groq client
_client = None

def get_client():
    """Get or create Groq client with lazy initialization"""
    global _client
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client

def client():
    """Alias for get_client for convenience"""
    return get_client()

# Model configuration
DEFAULT_MODEL = "llama-3.1-8b-instant"  # Fast and cost-effective
PREMIUM_MODEL = "llama-3.3-70b-versatile"  # More capable


def generate_content(prompt: str, model: str = DEFAULT_MODEL, temperature: float = 0.7, max_tokens: int = 4000) -> str:
    """
    Generate content using Groq API
    
    Args:
        prompt: The prompt to send to the model
        model: Which Groq model to use
        temperature: Sampling temperature (0-1)
        max_tokens: Maximum tokens to generate
    
    Returns:
        Generated text from Groq
    """
    try:
        message = get_client().chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return message.choices[0].message.content or ""
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise


def generate_json_content(prompt: str, model: str = DEFAULT_MODEL, temperature: float = 0.3) -> dict:
    """
    Generate JSON content using Groq API
    
    Args:
        prompt: The prompt to send to the model
        model: Which Groq model to use
        temperature: Sampling temperature (0-1)
    
    Returns:
        Parsed JSON response from Groq
    """
    try:
        response = generate_content(
            prompt=prompt,
            model=model,
            temperature=temperature,
            max_tokens=8000
        )
        
        # Try to parse JSON from response
        # Sometimes model wraps response in markdown code blocks
        if "```json" in response:
            json_str = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            json_str = response.split("```")[1].split("```")[0].strip()
        else:
            json_str = response
            
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response: {response}")
        raise
    except Exception as e:
        print(f"Groq JSON Generation Error: {e}")
        raise


def generate_summary(text: str, context: str = "", max_tokens: int = 1500) -> str:
    """
    Generate a summary using Groq
    
    Args:
        text: Text to summarize
        context: Additional context
        max_tokens: Max tokens for summary
    
    Returns:
        Summary text
    """
    prompt = f"""Summarize the following text in a clear and concise manner. Focus on key points.

{f'Context: {context}' if context else ''}

Text to summarize:
{text}

Provide a well-structured summary."""

    return generate_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.5,
        max_tokens=max_tokens
    )


def generate_mcqs(text: str, num_questions: int = 10, difficulty: str = "mixed") -> dict:
    """
    Generate MCQs using Groq
    
    Args:
        text: Document text to generate MCQs from
        num_questions: Number of questions to generate
        difficulty: Easy, Medium, Hard, or mixed
    
    Returns:
        Dictionary with MCQ data
    """
    prompt = f"""Generate {num_questions} multiple choice questions based on the following document.

Document:
{text[:4000]}

Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{{
    "mcqs": [
        {{
            "question": "Question text here?",
            "options": {{"A": "option1", "B": "option2", "C": "option3", "D": "option4"}},
            "correct_answer": "A",
            "difficulty": "Easy",
            "explanation": "Why this is correct"
        }}
    ]
}}

Requirements:
- Each MCQ must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Difficulty level: {difficulty}
- Make questions useful for academic assessment
- Base questions ONLY on the provided document content
- Return ONLY the JSON object, no other text"""

    return generate_json_content(
        prompt=prompt,
        model=PREMIUM_MODEL,
        temperature=0.3
    )


def generate_quiz(text: str, document_type: str = "Research Paper") -> dict:
    """
    Generate a comprehensive quiz using Groq
    
    Args:
        text: Document text for quiz generation
        document_type: Type of document
    
    Returns:
        Quiz data as dictionary
    """
    prompt = f"""You are DocXtract Academia, an expert educational assessment generator.

Generate a comprehensive quiz STRICTLY based on the provided {document_type}.

Document content:
{text[:5000]}

Return ONLY a valid JSON object (no markdown, no extra text):
{{
    "document_type": "{document_type}",
    "quiz": {{
        "mcqs": [
            {{
                "question": "?",
                "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
                "correct_answer": "A",
                "difficulty": "Easy",
                "explanation": "..."
            }}
        ],
        "short_answer": [
            {{
                "question": "?",
                "sample_answer": "...",
                "difficulty": "Medium"
            }}
        ],
        "true_false": [
            {{
                "statement": "...",
                "correct_answer": true,
                "explanation": "..."
            }}
        ]
    }}
}}

Requirements:
- Generate 6 MCQs, 2 Short Answer, 2 True/False
- Mix of Easy, Medium, Hard difficulties
- Base ALL questions ONLY on the document
- Return ONLY the JSON object"""

    return generate_json_content(
        prompt=prompt,
        model=PREMIUM_MODEL,
        temperature=0.3
    )


def generate_flashcards(text: str, num_cards: int = 10) -> dict:
    """
    Generate flashcards using Groq
    
    Args:
        text: Document text
        num_cards: Number of flashcards to generate
    
    Returns:
        Flashcard data
    """
    prompt = f"""Generate {num_cards} educational flashcards from the document.

Document:
{text[:4000]}

Return ONLY JSON (no markdown):
{{
    "flashcards": [
        {{
            "front": "Question or prompt",
            "back": "Answer or explanation",
            "topic": "Category"
        }}
    ]
}}

Requirements:
- Create concise front/back pairs
- Base content ONLY on the document
- Return ONLY the JSON object"""

    return generate_json_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.4
    )


def compare_documents(doc1: str, doc2: str) -> dict:
    """
    Compare two documents using Groq
    
    Args:
        doc1: First document text
        doc2: Second document text
    
    Returns:
        Comparison analysis
    """
    prompt = f"""Compare these two documents and provide analysis.

Document 1:
{doc1[:3000]}

Document 2:
{doc2[:3000]}

Return ONLY JSON (no markdown):
{{
    "similarities": ["...", "..."],
    "differences": ["...", "..."],
    "summary": "Overall comparison summary"
}}"""

    return generate_json_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.5
    )


def extract_insights(text: str) -> dict:
    """
    Extract key insights from document using Groq
    
    Args:
        text: Document text
    
    Returns:
        Insights dictionary
    """
    prompt = f"""Extract key insights and important information from this document.

Document:
{text[:5000]}

Return ONLY JSON (no markdown):
{{
    "key_points": ["...", "..."],
    "main_theme": "...",
    "target_audience": "...",
    "actionable_insights": ["...", "..."]
}}"""

    return generate_json_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.4
    )


def generate_concept_graph(text: str, max_concepts: int = 15) -> dict:
    """
    Generate a concept graph from document using Groq
    
    Args:
        text: Document text
        max_concepts: Maximum number of concepts to extract
    
    Returns:
        Concept graph with nodes and links
    """
    prompt = f"""Analyze this document and extract {max_concepts} most important concepts and their relationships.

Document:
{text[:5000]}

Return ONLY JSON (no markdown):
{{
    "nodes": [
        {{
            "id": "concept_1",
            "label": "Concept Name",
            "type": "topic"
        }}
    ],
    "links": [
        {{
            "source": "concept_1",
            "target": "concept_2",
            "relation": "relationship description"
        }}
    ]
}}

Types: "topic" for abstract concepts, "entity" for concrete things"""

    return generate_json_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.4
    )


def generate_summary_comparison(text1: str, text2: str) -> dict:
    """
    Compare two documents using Groq
    
    Args:
        text1: First document text
        text2: Second document text
    
    Returns:
        Comparison summary
    """
    prompt = f"""Compare these two documents in detail.

Document 1:
{text1[:3000]}

Document 2:
{text2[:3000]}

Return ONLY JSON (no markdown):
{{
    "similarities": ["...", "..."],
    "differences": ["...", "..."],
    "summary": "Overall comparison",
    "notable_changes": ["...", "..."]
}}"""

    return generate_json_content(
        prompt=prompt,
        model=DEFAULT_MODEL,
        temperature=0.5
    )
