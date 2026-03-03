#!/usr/bin/env python
"""Direct Groq API test"""

from groq import Groq
from dotenv import load_dotenv
import os
import time

load_dotenv()
api_key = os.getenv('GROQ_API_KEY')

print(f'API Key set: {bool(api_key)}')
if api_key:
    print(f'Key starts with: {api_key[:10]}...')

try:
    print('Initializing Groq client...')
    client = Groq(api_key=api_key)
    print('[OK] Groq client initialized')
    
    print('Testing simple completion...')
    start = time.time()
    message = client.chat.completions.create(
        model='llama-3.1-8b-instant',
        messages=[{'role': 'user', 'content': 'Say hello in one word'}],
        temperature=0.7,
        max_tokens=50,
    )
    elapsed = time.time() - start
    print(f'[OK] Response received in {elapsed:.2f}s')
    print(f'Content: {message.choices[0].message.content}')
except Exception as e:
    print(f'[ERROR] {type(e).__name__}: {str(e)}')
    import traceback
    traceback.print_exc()
