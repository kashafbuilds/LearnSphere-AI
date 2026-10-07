import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
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


class QuizRequest(BaseModel):
    topic: str
    subject: str = "General"
    learning_mode: str = "Beginner"


@app.post("/api/quiz")
def generate_quiz(request: QuizRequest):
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"""
You are LearnSphere AI, a friendly educational quiz generator.

Create exactly 5 multiple-choice questions about this topic.

Topic: {request.topic}
Subject: {request.subject}
Learning Mode: {request.learning_mode}

Return ONLY valid JSON.

Use exactly this format:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct_answer": 0,
      "explanation": "Short explanation"
    }}
  ]
}}

Important:
- Create exactly 5 questions.
- Each question must have exactly 4 options.
- correct_answer must be a number from 0 to 3.
- 0 means the first option is correct.
- 1 means the second option is correct.
- 2 means the third option is correct.
- 3 means the fourth option is correct.
- Do not include A, B, C, or D inside the options themselves.
- Do not use Markdown.
- Do not add any text before or after the JSON.
""",
    )

    quiz_data = json.loads(response.text)

    return {
        "topic": request.topic,
        "subject": request.subject,
        "learning_mode": request.learning_mode,
        "questions": quiz_data["questions"],
    }

@app.post("/api/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    subject: str = "General",
    learning_mode: str = "Beginner",
):
    image_bytes = await file.read()

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            {
                "inline_data": {
                    "mime_type": file.content_type,
                    "data": image_bytes,
                }
            },
            f"""
You are LearnSphere AI, a friendly personalized learning companion.

Analyze the uploaded image and help the student understand it.

Subject: {subject}
Learning Mode: {learning_mode}

Instructions:
- Describe what is visible in the image.
- Explain the important concept step by step.
- For Beginner mode, use simple language and easy examples.
- For Intermediate mode, provide more technical detail.
- For Advanced mode, explain deeper concepts and practical details.
- For Exam Preparation mode, focus on important exam points and definitions.
- If the image contains a question or problem, solve it clearly.
- If the image contains code, explain what the code does and point out important issues.
- If the image is unclear, honestly say what cannot be determined.

Give a helpful educational explanation.
""",
        ],
    )

    return {
        "filename": file.filename,
        "subject": subject,
        "learning_mode": learning_mode,
        "analysis": response.text,
    }