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
    subject: str = "General"
    learning_mode: str = "Beginner"


@app.get("/")
def root():
    return {"message": "LearnSphere AI API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/ask")
def ask_question(request: QuestionRequest):
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"""
You are LearnSphere AI, a friendly personalized learning companion.

The student selected:
Subject: {request.subject}
Learning Mode: {request.learning_mode}

Answer the student's question according to the selected subject and learning mode.

For Beginner mode:
- Use simple language.
- Explain concepts step by step.
- Give easy examples.

For Intermediate mode:
- Give more technical detail.
- Assume the student already understands the basics.
- Include useful examples.

For Advanced mode:
- Give technically detailed explanations.
- Discuss deeper concepts and practical considerations.

For Exam Preparation mode:
- Focus on important exam concepts.
- Use clear definitions.
- Highlight key points.
- Include short examples where useful.

Student question:
{request.question}
""",
    )

    return {
        "question": request.question,
        "subject": request.subject,
        "learning_mode": request.learning_mode,
        "answer": response.text,
    }