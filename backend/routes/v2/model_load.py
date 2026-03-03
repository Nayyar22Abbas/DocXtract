from llama_cpp import Llama

# Model loading disabled - using Groq API instead
# If you need to enable this, ensure the model path exists: llm/mistral-7b-instruct-v0.2.Q4_K_M.gguf
llm = None

# Original code (disabled):
# llm = Llama(
# model_path="llm/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
# n_ctx=4096,
# n_threads=4,
# verbose=False
# )