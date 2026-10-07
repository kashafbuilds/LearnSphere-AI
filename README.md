# LearnSphere AI

**Your personalized learning companion**

LearnSphere AI is a personalized, multimodal AI learning companion that helps students learn concepts, practice through interactive quizzes, and understand uploaded images with AI-powered explanations.

## ✨ Features

* 🤖 **AI Learning Assistant** — Ask questions and get personalized explanations.
* 📚 **Subject Selection** — Choose from Computer Science, Mathematics, Science, English, Business, or General.
* 🎯 **Learning Modes** — Beginner, Intermediate, Advanced, and Exam Preparation.
* 🧠 **Interactive AI Quiz** — Generate a 5-question quiz with automatic scoring and explanations.
* 🖼️ **Image Analysis** — Upload an image containing a question, code, diagram, or learning material and get an AI explanation.
* 📖 **Learning History** — Keep track of recently asked questions and AI responses.
* 🧹 **Clear History** — Remove saved learning history when needed.
* 📱 **Responsive Design** — Tested across desktop and mobile screen sizes.

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
│   │       └── page.tsx
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

Backend will run at:

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

The frontend will normally run at:

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

The project `.gitignore` already excludes environment files and local development dependencies.

## 🔌 API Endpoints

| Method | Endpoint             | Purpose                   |
| ------ | -------------------- | ------------------------- |
| GET    | `/`                  | API status                |
| GET    | `/health`            | Backend health check      |
| POST   | `/api/ask`           | AI learning assistant     |
| POST   | `/api/quiz`          | Generate interactive quiz |
| POST   | `/api/analyze-image` | Analyze uploaded images   |

## 🎓 Learning Experience

LearnSphere AI is designed around personalized learning:

1. Select a subject.
2. Choose a learning mode.
3. Ask a question.
4. Receive an AI-generated explanation.
5. Practice with an interactive quiz.
6. Upload learning material or questions for image analysis.
7. Review previous learning activity through Learning History.

## 📱 Responsive Testing

The application has been tested across multiple mobile screen sizes, including:

* iPhone 16
* Google Pixel 10
* iPhone SE

The desktop interface and mobile layouts were also checked for visual and functional issues.

## 🔮 Future Improvements

Potential future improvements include:

* User authentication and individual profiles
* Persistent database-backed learning history
* Progress tracking and learning analytics
* More multimedia learning formats
* Voice-based learning
* Personalized study plans
* Additional AI-powered educational tools

## 👩‍💻 Author

**Kashaf Munir**

Web Developer | AI Engineering Learner

GitHub: [@kashafbuilds](https://github.com/kashafbuilds)

---

Built with ❤️ using Next.js, FastAPI, and Google Gemini.
