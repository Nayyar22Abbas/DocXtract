from v2_model_services.mcq_generation.mcq_prompt import mcq_prompt
from routes.v2.model_load import llm
def generate_mcqs(chunk, mcq_count):
    response = llm(
        mcq_prompt(chunk, mcq_count),
        max_tokens=400,
        temperature=0.2,
        top_p=0.9,
        stop=["</s>"]
    )
    return response["choices"][0]["text"] #type: ignore