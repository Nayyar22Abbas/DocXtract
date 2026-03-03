from Services.groq_service import generate_quiz as groq_generate_quiz
import os
import json
import re
import asyncio
import logging
from functools import partial
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)

async def generate_quiz_content(context: str, document_type: str = "Research Paper"):
    """
    Generates a quiz using Groq API based on the provided context.
    Now uses Groq instead of Gemini for better performance and cost efficiency.
    Runs in executor to avoid blocking the event loop.
    """
    try:
        logger.info(f"Generating quiz ({len(context)} chars) for {document_type}")
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            partial(groq_generate_quiz, text=context, document_type=document_type)
        )
        logger.info(f"Quiz generated successfully")
        return result
    except Exception as e:
        import traceback
        logger.error(f"Error in generate_quiz_content: {e}")
