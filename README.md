# LearnSphere AI

**Your personalized learning companion**

LearnSphere AI is a personalized, multimodal AI learning companion designed to help students understand concepts, learn from their own study materials, practice through adaptive quizzes, and receive source-grounded AI explanations.

It combines AI tutoring with **textbooks, lecture slides, lecture videos, images, and interactive assessments** in one learning experience.

## ✨ Features

* 🤖 **AI Learning Assistant** — Ask questions and receive personalized explanations based on subject and learning level.
* 📚 **Multimodal Learning Materials** — Upload TXT, PDF, and PPTX study materials and use them as a source-grounded knowledge base.
* 🎥 **Lecture Video Learning** — Upload lecture videos and process them using Gemini multimodal AI.
* 🔎 **Source-Grounded Answers** — Material-based answers include supporting source references such as slide or page locations.
* 🎯 **Adaptive Learning** — Quiz difficulty adapts according to the learner's previous performance.
* 🧠 **Interactive AI Quizzes** — Generate five-question quizzes with automatic scoring and explanations.
* 🖼️ **Image Analysis** — Upload study images, equations, diagrams, handwritten problems, or learning material for AI-powered explanations.
* 📖 **Learning History** — Keep track of recently asked learning questions and AI responses.
* 🧹 **Clear History** — Remove saved learning history when needed.
* 📱 **Responsive Design** — Designed and tested for desktop and mobile screen sizes.

## 🎓 Personalized & Adaptive Learning

LearnSphere AI adapts the learning experience according to learner performance.

For example:

* **Low score** → The next quiz focuses on core concepts and easier questions.
* **Medium score** → The next quiz maintains a similar difficulty level.
* **High score** → The next quiz moves toward more challenging concepts.

This creates a progressive learning experience instead of generating the same difficulty of quiz every time.

## 📚 Multimodal Knowledge Base

LearnSphere AI can work with multiple types of educational content:

| Material | Processing                       |
| -------- | -------------------------------- |
| TXT      | Text extraction                  |
| PDF      | Page-based text extraction       |
| PPTX     | Slide-based text extraction      |
| MP4      | Gemini multimodal video analysis |
| WEBM     | Gemini multimodal video analysis |
| MOV      | Gemini multimodal video analysis |
| M4V      | Gemini multimodal video analysis |
| Images   | Gemini-powered visual analysis   |

Uploaded documents can be used for source-grounded questions and adaptive quizzes.

Lecture videos are processed using Gemini multimodal AI to extract structured educational content with approximate video timestamps.

## 🔎 Source-Grounded Learning

When students ask questions about uploaded learning material, LearnSphere AI generates answers grounded in the provided source.

The application can display references such as:

* **Slide 4**
* **Page 2**
* **Lecture Video 00:00–01:00**

This helps students understand where the information came from instead of receiving an unsupported AI-generated answer.

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI

* Google Gemini API
* `google-genai`

### Document & Media Processing

* `python-pptx`
* PDF text extraction
* Gemini multimodal video processing

## 📁 Project Structure

```text
LearnSphere-AI/

├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── layout.tsx
│   │       └── globals.css
│   └── ...
│
├── .gitignore
└── README.md
```

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/kashafbuilds/LearnSphere-AI.git
cd LearnSphere-AI
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## 🔐 Environment Variables

The backend requires a Google Gemini API key.

Create:

```text
backend/.env
```

with:

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Never commit your `.env` file or API key to GitHub.**

The project `.gitignore` excludes environment files and local development dependencies.

## 🔌 API Endpoints

| Method | Endpoint               | Purpose                                       |
| ------ | ---------------------- | --------------------------------------------- |
| GET    | `/`                    | API status                                    |
| GET    | `/health`              | Backend health check                          |
| POST   | `/api/ask`             | AI learning assistant                         |
| POST   | `/api/quiz`            | Generate adaptive AI quiz                     |
| POST   | `/api/analyze-image`   | Analyze uploaded images                       |
| POST   | `/api/upload-material` | Upload and extract learning material          |
| POST   | `/api/material-ask`    | Ask questions about uploaded material         |
| POST   | `/api/material-quiz`   | Generate adaptive quiz from uploaded material |

## 🎯 Hackathon Track

**Track D — Personalized Tutoring & Adaptive Learning**

LearnSphere AI addresses personalized tutoring by combining:

1. **Multimodal learning materials**

   * Text notes
   * Textbooks
   * Lecture slides
   * Lecture videos
   * Images

2. **Source-grounded tutoring**

   * Answers based on uploaded learning material
   * Slide/page references for supporting evidence

3. **Adaptive assessment**

   * Quiz performance is tracked
   * Difficulty changes according to previous scores
   * Learners receive easier, similar, or harder questions based on performance

4. **Personalized learning modes**

   * Beginner
   * Intermediate
   * Advanced
   * Exam Preparation

## 🎓 Learning Experience

The typical learning flow is:

1. Select a subject.
2. Choose a learning mode.
3. Ask a learning question.
4. Receive an AI-generated explanation.
5. Upload study material if deeper source-based learning is needed.
6. Ask questions about the uploaded material.
7. View supporting source references.
8. Generate an adaptive quiz.
9. Receive a score.
10. Continue learning at an adjusted difficulty level.
11. Review previous learning activity through Learning History.

## 📱 Responsive Testing

The application has been tested across multiple screen sizes, including:

* iPhone 16
* Google Pixel 10
* iPhone SE
* Desktop layouts

Both visual layout and core interactions were checked across responsive screen sizes.

## 🔮 Future Improvements

Potential future improvements include:

* User authentication and individual profiles
* Persistent database-backed learning history
* Long-term progress tracking and learning analytics
* Personalized study plans
* Voice-based learning
* More multimedia learning formats
* Additional AI-powered educational tools

## 👩‍💻 Author

**Kashaf Munir**

Web Developer | AI Engineering Learner

GitHub: [@kashafbuilds](https://github.com/kashafbuilds)

---

Built with ❤️ using Next.js, FastAPI, and Google Gemini.
