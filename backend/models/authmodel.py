from pydantic import BaseModel



class UserCreate(BaseModel):
    username: str
    password: str  # plain text

# Input from client during login
class UserLogin(BaseModel):
    username: str
    password: str

# JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str