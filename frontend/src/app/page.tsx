"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type ChatMessage = {
  question: string;
  answer: string;
  subject: string;
  learningMode: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("General");
  const [learningMode, setLearningMode] = useState("Beginner");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [quizTopic, setQuizTopic] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const handleStartLearning = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          subject,
          learning_mode: learningMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      setAnswer(data.answer);

      setChatHistory((previousHistory) => [
        {
          question: data.question,
          answer: data.answer,
          subject: data.subject,
          learningMode: data.learning_mode,
        },
        ...previousHistory,
      ]);
    } catch (error) {
      console.error(error);
      setAnswer(
        "Sorry, I could not connect to LearnSphere AI. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) {
      return;
    }

    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: quizTopic,
          subject,
          learning_mode: learningMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();

      setQuizQuestions(data.questions);
    } catch (error) {
      console.error(error);
      alert(
        "Sorry, I could not generate the quiz. Please make sure the backend is running."
      );
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === quizQuestions[currentQuestion].correct_answer) {
      setQuizScore((score) => score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((questionNumber) => questionNumber + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    setAnswer("");
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) {
      return;
    }

    setImageLoading(true);
    setImageAnalysis("");

    try {
      const formData = new FormData();

      formData.append("file", imageFile);
      formData.append("subject", subject);
      formData.append("learning_mode", learningMode);

      const response = await fetch(`${API_URL}/api/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();

      setImageAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      setImageAnalysis(
        "Sorry, I could not analyze the image. Please make sure the backend is running."
      );
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8">
        {/* Header */}
        <header className="text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            AI Learning • Personalized • Multimodal • Interactive
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            LearnSphere AI
          </h1>

          <p className="mt-4 text-xl font-medium text-slate-300">
            Your personalized learning companion
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Learn anything with your AI companion.
          </p>
        </header>

        {/* Learning Section */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              📚 AI Learning Assistant
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Ask anything and learn with an explanation tailored to you.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              >
                <option value="General">General</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Learning Mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Learning Mode
              </label>

              <select
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Exam Preparation">
                  Exam Preparation
                </option>
              </select>
            </div>
          </div>

          {/* Question */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              What do you want to learn?
            </label>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Explain how APIs work..."
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleStartLearning}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Learning..." : "Start Learning"}
          </button>

          {/* AI Answer */}
          {answer && (
            <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-left">
              <p className="mb-3 font-semibold text-indigo-300">
                🤖 LearnSphere AI
              </p>

              <div className="text-sm leading-7 text-slate-300">
                {answer.split("\n").map((line, index) => (
                  <p key={index} className="mb-2">
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Quiz Section */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              🧠 Interactive Quiz
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Generate a personalized 5-question quiz with AI.
            </p>
          </div>

          {!quizQuestions.length && !quizFinished && (
            <>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Quiz Topic
                </label>

                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="Example: JavaScript basics"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={quizLoading}
                className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quizLoading ? "Generating Quiz..." : "Generate Quiz"}
              </button>
            </>
          )}

          {quizQuestions.length > 0 && !quizFinished && (
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                <span>
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>

                <span>Score: {quizScore}</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="text-lg font-semibold leading-7">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="mt-5 space-y-3">
                  {quizQuestions[currentQuestion].options.map(
                    (option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect =
                        index ===
                        quizQuestions[currentQuestion].correct_answer;

                      let optionClass =
                        "border-slate-700 bg-slate-900 hover:border-indigo-500";

                      if (selectedAnswer !== null) {
                        if (isCorrect) {
                          optionClass =
                            "border-green-500 bg-green-500/10";
                        } else if (isSelected) {
                          optionClass =
                            "border-red-500 bg-red-500/10";
                        } else {
                          optionClass =
                            "border-slate-800 bg-slate-900";
                        }
                      }

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full rounded-xl border p-4 text-left text-sm transition ${optionClass}`}
                        >
                          {option}
                        </button>
                      );
                    }
                  )}
                </div>

                {selectedAnswer !== null && (
                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-sm leading-6 text-slate-300">
                      <span className="font-semibold text-indigo-300">
                        Explanation:
                      </span>{" "}
                      {quizQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                {selectedAnswer !== null && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
                  >
                    {currentQuestion === quizQuestions.length - 1
                      ? "Finish Quiz"
                      : "Next Question"}
                  </button>
                )}
              </div>
            </div>
          )}

          {quizFinished && (
            <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6 text-center">
              <h3 className="text-2xl font-semibold">
                🎉 Quiz Complete!
              </h3>

              <p className="mt-3 text-slate-300">
                Your score:
              </p>

              <p className="mt-1 text-4xl font-bold text-indigo-300">
                {quizScore} / {quizQuestions.length}
              </p>

              <button
                type="button"
                onClick={handleRestartQuiz}
                className="mt-5 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
              >
                Create Another Quiz
              </button>
            </div>
          )}
        </section>

        {/* Image Analysis Section */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="text-left">
            <h2 className="text-2xl font-semibold">
              🖼️ Analyze an Image
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Upload a diagram, notes, question, or educational image and
              let LearnSphere AI explain it for you.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5">
            <label className="block cursor-pointer">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Choose an image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  setImageFile(file);
                  setImageAnalysis("");
                }}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
              />
            </label>

            {imageFile && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left">
                <p className="text-sm font-medium text-white">
                  Selected image:
                </p>

                <p className="mt-1 break-all text-sm text-slate-400">
                  {imageFile.name}
                </p>

                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={imageLoading}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {imageLoading
                    ? "Analyzing Image..."
                    : "Analyze Image"}
                </button>
              </div>
            )}

            {imageAnalysis && (
              <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-left">
                <p className="mb-4 font-semibold text-indigo-300">
                  AI Analysis
                </p>

                <div className="text-sm leading-7 text-slate-300">
                  {imageAnalysis
                    .replace(/\\---/g, "")
                    .replace(/\\####/g, "")
                    .replace(/\\###/g, "")
                    .replace(/\\\*\*/g, "")
                    .replace(/\*\*/g, "")
                    .replace(/\\\*/g, "")
                    .replace(/\$\$/g, "")
                    .split("\n")
                    .map((line, index) => (
                      <p key={index} className="mb-2">
                        {line.trim() || "\u00A0"}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Learning History */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                📖 Learning History
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Review your previous AI learning sessions.
              </p>
            </div>

            {chatHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:text-red-400"
              >
                Clear History
              </button>
            )}
          </div>

          {chatHistory.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
              No learning history yet. Start learning to see your sessions
              here.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {chatHistory.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300">
                      {item.subject}
                    </span>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-400">
                      {item.learningMode}
                    </span>
                  </div>

                  <p className="mt-4 font-medium text-white">
                    {item.question}
                  </p>

                  <div className="mt-3 text-sm leading-7 text-slate-400">
                    {item.answer.split("\n").map((line, lineIndex) => (
                      <p key={lineIndex} className="mb-2">
                        {line || "\u00A0"}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-10 text-center text-sm text-slate-500">
          <p>
            LearnSphere AI • Your personalized learning companion
          </p>

          <p className="mt-2">
            AI Learning • Personalized • Multimodal • Interactive
          </p>
        </footer>
      </div>
    </main>
  );
}
