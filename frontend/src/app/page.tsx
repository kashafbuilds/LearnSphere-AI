"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

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
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer(
        "Sorry, I could not connect to LearnSphere AI. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
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
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to learn today?"
              className="min-h-32 w-full resize-none bg-transparent p-3 text-white outline-none placeholder:text-slate-500"
            />

            <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-sm text-slate-500">
                Ask your first question
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
        </section>

        <footer className="mt-10 text-center text-sm text-slate-600">
          LearnSphere AI
        </footer>
      </div>
    </main>
  );
}