#!/usr/bin/env python
"""Test groq_service.generate_summary directly"""

from Services.groq_service import generate_summary
import time

test_text = """
Machine learning is a subset of artificial intelligence that focuses on developing systems 
that can learn and improve from experience without being explicitly programmed. 
The main idea is that systems can learn from data, identify patterns, and make decisions 
with minimal human intervention. There are three main types of machine learning: 
supervised learning, unsupervised learning, and reinforcement learning.
"""

try:
    print('Testing groq_service.generate_summary()...')
    start = time.time()
    result = generate_summary(test_text, context="Summarize this ML concept", max_tokens=200)
    elapsed = time.time() - start
    print(f'[OK] Summary generated in {elapsed:.2f}s')
    print(f'Result: {result[:200]}...')
except Exception as e:
    print(f'[ERROR] {type(e).__name__}: {str(e)}')
    import traceback
    traceback.print_exc()
