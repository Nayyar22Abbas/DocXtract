from v2_model_services.mcq_generation.mcq_prompt import mcq_prompt
from routes.v2.model_load import llm
def generate_mcqs(chunk, mcq_count):
    # Increase max_tokens based on count (roughly 150 tokens per MCQ)
    max_tokens = max(1000, mcq_count * 200)
    response = llm(
        mcq_prompt(chunk, mcq_count),
        max_tokens=max_tokens,
        temperature=0.2,
        top_p=0.9,
        stop=["</s>"]
    )
    return response["choices"][0]["text"] #type: ignore