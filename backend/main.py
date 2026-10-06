import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in the .env file")

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="LearnSphere AI",
    version="1.0.0",
    description="Personalized Multimodal Learning Companion",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "LearnSphere AI API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/ask")
def ask_question(request: QuestionRequest):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"""
You are LearnSphere AI, a friendly personalized learning companion.

Answer the student's question clearly and accurately.
Explain difficult concepts in beginner-friendly language.
Use examples when helpful.

Student question:
{request.question}
""",
    )

    return {
        "question": request.question,
        "answer": response.text,
    }