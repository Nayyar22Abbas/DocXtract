from distilbert_base_uncased import load_model, load_tokenizer, DistilBertPipeline #type: ignore

def summarize_text(text, max_length=30):
    """
    Simulates text summarization using DistilBertModel and DistilBertTokenizer.
    """
   
    model = load_model()
    tokenizer = load_tokenizer()
    
    
    tokens = tokenizer.encode(text)
    
    
    _ = model.get_embeddings(tokens)
    
    
    words = text.split()
    summary_words = []
    i = 0
    while len(summary_words) < max_length and i < len(words):
        
        summary_words.append(words[i])
        i += 2
    
    summary = " ".join(summary_words)
    return summary


def summarize_with_pipeline(text, max_length=30):
    pipeline = DistilBertPipeline()
    return pipeline(text, max_length=max_length)


if __name__ == "__main__":
    text = ("Artificial intelligence is rapidly evolving, "
            "and it has applications in healthcare, finance, education, "
            "and many other sectors.")
    
    summary = summarize_text(text)
    print(" Summary:", summary)
    
    
    pipeline_summary = summarize_with_pipeline(text)
    print("Pipeline Summary:", pipeline_summary)
