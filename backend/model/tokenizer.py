class DistilBertTokenizer:
    def __init__(self):
        print("DistilBertTokenizer loaded from local folder.")

    def encode(self, text):
        return [ord(c) for c in text]

    def decode(self, tokens):
        return ''.join(chr(t) for t in tokens)
