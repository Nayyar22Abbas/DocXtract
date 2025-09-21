from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routes.v1.contentgeneration import router
from routes.v1.userauth import authuser
from routes.v1.protectedroute import protected_router
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os




 
app= FastAPI()


origins=[
    "http://localhost:3000",  # Replace with your Next.js frontend's URL
    "http://localhost",  


]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],       #allow all HTTP methods
    allow_headers=["*"]        #allow all headers
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET","supersecret")   



)





app.include_router(router,prefix="/users", tags=["Users"])
app.include_router(authuser,prefix="/authuser",tags=["AuthUser"])
app.include_router(protected_router,prefix="/protected_route", tags=["protected"])

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")





