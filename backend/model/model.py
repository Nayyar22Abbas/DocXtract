import random

class DistilBertModel:
    def __init__(self, vocab_size=30522, hidden_size=768):
 
        self.vocab_size = vocab_size
        self.hidden_size = hidden_size
        print(f"DistilBertModel initialized with hidden size {hidden_size} and vocab size {vocab_size}")

    def encode_text(self, text):
       
        tokens = [ord(c) % self.vocab_size for c in text]
        print(f"Encoding text: '{text}' -> {tokens}")
        return tokens

    def get_embeddings(self, tokens):
    
        embeddings = [[random.random() for _ in range(self.hidden_size)] for _ in tokens]
        print(f"Generated embeddings for {len(tokens)} tokens.")
        return embeddings

    def generate(self, text, max_length=50):
      
        words = text.split()
        output = []
        while len(output) < max_length:
            output.append(random.choice(words))
        generated_text = " ".join(output)
        print(f"Generated text: {generated_text}")
        return generated_text
