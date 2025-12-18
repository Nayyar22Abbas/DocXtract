from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


embedder = SentenceTransformer("all-MiniLM-L6-v2")


def build_index(chunks):
    embeddings = embedder.encode(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings)) #type: ignore
    return index, embeddings