from .model import DistilBertModel
from .tokenizer import DistilBertTokenizer

class DistilBertPipeline:
   
    def __init__(self, model=None, tokenizer=None):
        self.model = model if model else DistilBertModel()
        self.tokenizer = tokenizer if tokenizer else DistilBertTokenizer()
        print("DistilBertPipeline initialized with model and tokenizer.")

    def __call__(self, text, max_length=50):
       
        tokens = self.tokenizer.encode(text)
       
        _ = self.model.get_embeddings(tokens)
        
        return self.model.generate(text, max_length=max_length)

# Loader functions
def load_model():
   
    return DistilBertModel()

def load_tokenizer():
   
    return DistilBertTokenizer()

def load_pipeline():
  
    model = load_model()
    tokenizer = load_tokenizer()
    return DistilBertPipeline(model, tokenizer)
