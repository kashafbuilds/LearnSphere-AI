"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type ChatMessage = {
  question: string;
  answer: string;
  subject: string;
  learningMode: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("General");
  const [learningMode, setLearningMode] = useState("Beginner");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleStartLearning = async () => {
    if (!question.trim()) {
      return;
    }

    const currentQuestion = question.trim();

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
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
        ...previousHistory,
        {
          question: currentQuestion,
          answer: data.answer,
          subject,
          learningMode,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);
      setAnswer(
        "Sorry, I could not connect to LearnSphere AI. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setAnswer("");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LearnSphere AI</h1>

            <p className="mt-1 text-sm text-slate-400">
              Your personalized learning companion
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            AI Learning
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300">
            Personalized • Multimodal • Interactive
          </div>

          <h2 className="max-w-3xl text-5xl font-bold tracking-tight">
            Learn anything with your
            <span className="text-indigo-400"> AI companion.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Ask questions, explore concepts, and get personalized explanations
            designed around the way you learn.
          </p>

          <div className="mt-10 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-left">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Subject
                </label>

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="General">General</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="text-left">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Learning Mode
                </label>

                <select
                  value={learningMode}
                  onChange={(e) => setLearningMode(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
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

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to learn today?"
              className="mt-4 min-h-32 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
            />

            <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-sm text-slate-500">
                {subject} • {learningMode}
              </span>

              <button
                type="button"
                onClick={handleStartLearning}
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Learning..." : "Start Learning"}
              </button>
            </div>

            {answer && (
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-5 text-left text-sm leading-7 text-slate-300">
                {answer}
              </div>
            )}
          </div>

          {chatHistory.length > 0 && (
            <div className="mt-10 w-full max-w-2xl text-left">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Learning History</h3>

                <button
                  type="button"
                  onClick={clearChatHistory}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300">
                        {chat.subject}
                      </span>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                        {chat.learningMode}
                      </span>
                    </div>

                    <p className="font-medium text-white">
                      Q: {chat.question}
                    </p>

                    <div className="mt-3 border-t border-slate-800 pt-3 text-sm leading-7 text-slate-300">
                      {chat.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-sm text-slate-600">
          LearnSphere AI
        </footer>
      </div>
    </main>
  );
}