from routes.v2.model_load import llm


def ask_mistral(context, question):
    prompt = f"""
    You are an intelligent document assistant.


    Context:
    {context}


    Question:
    {question}
    """
    output = llm(prompt, max_tokens=400)
    return output["choices"][0]["text"] # type: ignore