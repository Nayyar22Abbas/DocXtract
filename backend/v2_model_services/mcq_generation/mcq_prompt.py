def mcq_prompt(text, mcq_count):
    return f"""
[INST]
You are an expert teacher.

Generate exactly {mcq_count} multiple-choice questions (MCQs) from the given text.

Rules:
- Each MCQ must have 4 options (A, B, C, D)
- Only ONE option is correct
- Clearly specify the correct option
- Avoid repetition
- Questions must be strictly from the given text

Output strictly in JSON format:

[
  {{
    "question": "",
    "options": {{
      "A": "",
      "B": "",
      "C": "",
      "D": ""
    }},
    "correct_answer": ""
  }}
]

Text:
{text}
[/INST]
"""