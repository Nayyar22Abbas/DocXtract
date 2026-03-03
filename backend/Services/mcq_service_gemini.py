from Services.groq_service import generate_mcqs as groq_generate_mcqs
import os
import json
from dotenv import load_dotenv
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

load_dotenv()

async def generate_mcqs_gemini(context: str, total_mcqs: int = 10):
    """
    Generates MCQs using Groq API based on the provided context.
    
    Note: Function name kept as 'generate_mcqs_gemini' for backward compatibility,
    but now uses Groq API instead of Gemini for better performance and cost efficiency.
    
    Returns a list of MCQ objects with question, options, and correct_answer.
    Runs in executor to avoid blocking the event loop.
    """
    try:
        logger.info(f"Generating {total_mcqs} MCQs ({len(context)} chars)")
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            partial(groq_generate_mcqs, text=context, num_questions=total_mcqs)
        )
        logger.info(f"MCQs generated successfully")
        
        # Convert Groq response format to expected format
        if result and "mcqs" in result:
            validated_mcqs = []
            for mcq in result["mcqs"]:
                if isinstance(mcq, dict) and mcq.get("question") and mcq.get("options"):
                    # Convert options dict to list if needed
                    options = mcq.get("options")
                    if isinstance(options, dict):
                        options = list(options.values())
                    
                    validated_mcqs.append({
                        "question": mcq.get("question"),
                        "options": options,
                        "correct_answer": mcq.get("correct_answer"),
                        "difficulty": mcq.get("difficulty", "Medium"),
                        "explanation": mcq.get("explanation", "")
                    })
            return validated_mcqs
        return []
            
    except Exception as e:
        logger.error(f"Error in generate_mcqs_gemini: {e}")
        import traceback
        traceback.print_exc()
        return []

