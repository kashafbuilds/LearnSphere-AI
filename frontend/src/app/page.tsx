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

type QuizSource = {
  location: string;
  evidence: string;
};

type MaterialResult = {
  filename: string;
  file_type: string;
  characters: number;
  source: string;
  text: string;
  message: string;
  video_supported?: boolean;
};

export default function Home() {
  // ============================================================
  // AI LEARNING ASSISTANT
  // ============================================================

  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("General");
  const [learningMode, setLearningMode] = useState("Beginner");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // ============================================================
  // QUIZ
  // ============================================================

  const [quizTopic, setQuizTopic] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSource, setQuizSource] = useState<
    "topic" | "material" | null
  >(null);

  const [materialQuizLoading, setMaterialQuizLoading] = useState(false);

  const [lastQuizScore, setLastQuizScore] = useState<number>(-1);

  const [adaptiveMessage, setAdaptiveMessage] = useState("");

  // ============================================================
  // IMAGE ANALYSIS
  // ============================================================

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // ============================================================
  // LEARNING MATERIAL
  // ============================================================

  const [materialFile, setMaterialFile] = useState<File | null>(null);

  const [materialResult, setMaterialResult] =
    useState<MaterialResult | null>(null);

  const [materialLoading, setMaterialLoading] = useState(false);

  // ============================================================
  // MATERIAL Q&A
  // ============================================================

  const [materialQuestion, setMaterialQuestion] = useState("");
  const [materialAnswer, setMaterialAnswer] = useState("");
  const [materialSources, setMaterialSources] =
    useState<QuizSource[]>([]);
  const [materialAskLoading, setMaterialAskLoading] = useState(false);

  // ============================================================
  // ASK AI
  // ============================================================

  const handleStartLearning = async () => {
    if (!question.trim()) return;

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

  // ============================================================
  // ASK FROM UPLOADED MATERIAL
  // ============================================================

  const handleAskFromMaterial = async () => {
    if (!materialResult?.text || !materialQuestion.trim()) return;

    setMaterialAskLoading(true);
    setMaterialAnswer("");
    setMaterialSources([]);

    try {
      const response = await fetch(`${API_URL}/api/material-ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: materialQuestion,
          material_text: materialResult.text,
          subject,
          learning_mode: learningMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer from material");
      }

      const data = await response.json();

      setMaterialAnswer(data.answer || "");

      setMaterialSources(
        Array.isArray(data.sources)
          ? data.sources
          : []
      );
    } catch (error) {
      console.error(error);

      setMaterialAnswer(
        "Sorry, I could not answer from the uploaded material. Please make sure the backend is running."
      );

      setMaterialSources([]);
    } finally {
      setMaterialAskLoading(false);
    }
  };

  // ============================================================
  // GENERATE NORMAL QUIZ
  // ============================================================

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;

    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSource("topic");
    setAdaptiveMessage("");

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
          previous_score: lastQuizScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();

      setQuizQuestions(data.questions);

      if (data.adaptive_direction === "harder") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: Your previous score was strong, so this quiz is more challenging."
        );
      } else if (data.adaptive_direction === "easier") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: Your previous score was low, so this quiz focuses more on fundamentals."
        );
      } else if (data.adaptive_direction === "same") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: This quiz keeps a similar difficulty level to your previous performance."
        );
      } else {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: This is your baseline quiz. Your next quiz will adapt to your performance."
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Sorry, I could not generate the quiz. Please make sure the backend is running."
      );
    } finally {
      setQuizLoading(false);
    }
  };

  // ============================================================
  // GENERATE QUIZ FROM MATERIAL
  // ============================================================

  const handleGenerateMaterialQuiz = async () => {
    if (!materialResult?.text) return;

    setMaterialQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSource("material");
    setAdaptiveMessage("");

    try {
      const response = await fetch(`${API_URL}/api/material-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          material_text: materialResult.text,
          subject,
          learning_mode: learningMode,
          previous_score: lastQuizScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz from material");
      }

      const data = await response.json();

      setQuizQuestions(data.questions);

      if (data.adaptive_direction === "harder") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: Your previous score was strong, so your material quiz is now harder."
        );
      } else if (data.adaptive_direction === "easier") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: Your previous score was low, so this quiz focuses on the core material."
        );
      } else if (data.adaptive_direction === "same") {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: Difficulty is matched to your previous performance."
        );
      } else {
        setAdaptiveMessage(
          "🎯 Adaptive Learning: This is your baseline material quiz."
        );
      }

      setTimeout(() => {
        document
          .getElementById("quiz-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error(error);

      alert(
        "Sorry, I could not generate the material quiz. Please make sure the backend is running."
      );
    } finally {
      setMaterialQuizLoading(false);
    }
  };

  // ============================================================
  // QUIZ ANSWER
  // ============================================================

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (
      index ===
      quizQuestions[currentQuestion].correct_answer
    ) {
      setQuizScore((score) => score + 1);
    }
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(
        (questionNumber) => questionNumber + 1
      );

      setSelectedAnswer(null);
    } else {
      const finalScore =
        quizScore +
        (selectedAnswer ===
        quizQuestions[currentQuestion].correct_answer
          ? 1
          : 0);

      const percentage = Math.round(
        (finalScore / quizQuestions.length) * 100
      );

      setLastQuizScore(percentage);
      setQuizFinished(true);
    }
  };

  // ============================================================
  // RESTART QUIZ
  // ============================================================

  const handleRestartQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSource(null);
  };

  // ============================================================
  // CLEAR HISTORY
  // ============================================================

  const handleClearHistory = () => {
    setChatHistory([]);
    setAnswer("");
  };

  // ============================================================
  // IMAGE ANALYSIS
  // ============================================================

  const handleAnalyzeImage = async () => {
    if (!imageFile) return;

    setImageLoading(true);
    setImageAnalysis("");

    try {
      const formData = new FormData();

      formData.append("file", imageFile);
      formData.append("subject", subject);
      formData.append("learning_mode", learningMode);

      const response = await fetch(
        `${API_URL}/api/analyze-image`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  // ============================================================
  // UPLOAD LEARNING MATERIAL
  // ============================================================

  const handleUploadMaterial = async () => {
    if (!materialFile) return;

    setMaterialLoading(true);
    setMaterialResult(null);
    setMaterialQuestion("");
    setMaterialAnswer("");
    setMaterialSources([]);

    try {
      const formData = new FormData();

      formData.append("file", materialFile);

      const response = await fetch(
        `${API_URL}/api/upload-material`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to upload material"
        );
      }

      const data: MaterialResult =
        await response.json();

      setMaterialResult(data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Sorry, I could not upload the material."
      );
    } finally {
      setMaterialLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-white">
                LearnSphere AI
              </h1>

              <p className="text-sm text-slate-400">
                Your personalized learning companion
              </p>
            </div>

            <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs text-indigo-300">
              AI Learning • Personalized • Multimodal • Interactive
            </div>

          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-center">

        <div className="mx-auto max-w-3xl">

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-indigo-400">
            LearnSphere AI
          </p>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Learn anything with your AI companion.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Ask questions, generate adaptive quizzes, analyze images,
            upload textbooks and slides, and learn from lecture videos
            with source-grounded AI.
          </p>

        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-16">

        {/* ================================================== */}
        {/* AI LEARNING ASSISTANT */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div>
            <p className="text-sm font-medium text-indigo-400">
              AI Learning Assistant
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              Ask your learning question
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose your subject and learning level, then ask
              LearnSphere AI anything.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option>General</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>English</option>
                <option>Programming</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Learning Mode
              </label>

              <select
                value={learningMode}
                onChange={(e) =>
                  setLearningMode(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Exam Preparation</option>
              </select>

            </div>

          </div>

          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Your Question
            </label>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="e.g. Explain recursion in programming..."
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />

          </div>

          <button
            type="button"
            onClick={handleStartLearning}
            disabled={loading || !question.trim()}
            className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Thinking..."
              : "Start Learning"}
          </button>

          {answer && (
            <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5">

              <p className="mb-3 font-semibold text-indigo-300">
                🤖 LearnSphere AI
              </p>

              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {answer}
              </div>

            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* QUIZ */}
        {/* ================================================== */}

        <section
          id="quiz-section"
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >

          <div>

            <p className="text-sm font-medium text-indigo-400">
              Interactive Adaptive Learning
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              {quizSource === "material"
                ? "Quiz From Your Learning Material"
                : "Generate an AI Quiz"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {quizSource === "material"
                ? "Test your understanding using questions generated from your uploaded material."
                : "Generate a personalized quiz that adapts to your previous performance."}
            </p>

          </div>

          {adaptiveMessage && (
            <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-300">
              {adaptiveMessage}
            </div>
          )}

          {lastQuizScore >= 0 && !quizQuestions.length && (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
              📊 Previous quiz performance:{" "}
              <span className="font-semibold text-white">
                {lastQuizScore}%
              </span>
            </div>
          )}

          {!quizQuestions.length ? (

            <div className="mt-6">

              <input
                type="text"
                value={quizTopic}
                onChange={(e) =>
                  setQuizTopic(e.target.value)
                }
                placeholder="e.g. JavaScript basics"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={
                  quizLoading ||
                  !quizTopic.trim()
                }
                className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quizLoading
                  ? "Generating Adaptive Quiz..."
                  : "Generate Adaptive Quiz"}
              </button>

            </div>

          ) : quizFinished ? (

            <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6 text-center">

              <div className="text-4xl">
                🎉
              </div>

              <h4 className="mt-3 text-2xl font-bold">
                Quiz Complete!
              </h4>

              <p className="mt-3 text-slate-300">
                Your score:
              </p>

              <p className="mt-1 text-4xl font-bold text-indigo-400">
                {quizScore} / {quizQuestions.length}
              </p>

              <p className="mt-3 text-sm text-slate-400">
                {Math.round(
                  (quizScore / quizQuestions.length) * 100
                )}
                % — Your next quiz will adapt to this performance.
              </p>

              <button
                type="button"
                onClick={handleRestartQuiz}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
              >
                Try Another Quiz
              </button>

            </div>

          ) : (

            <div className="mt-6">

              <div className="mb-5 flex items-center justify-between text-sm text-slate-400">

                <span>
                  Question {currentQuestion + 1} of{" "}
                  {quizQuestions.length}
                </span>

                <span>
                  Score: {quizScore}
                </span>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                <h4 className="text-lg font-semibold leading-7">
                  {
                    quizQuestions[currentQuestion]
                      .question
                  }
                </h4>

                <div className="mt-5 space-y-3">

                  {quizQuestions[
                    currentQuestion
                  ].options.map(
                    (option, index) => {

                      const isCorrect =
                        index ===
                        quizQuestions[
                          currentQuestion
                        ].correct_answer;

                      let optionClass =
                        "border-slate-700 bg-slate-900 hover:border-indigo-500";

                      if (
                        selectedAnswer !== null &&
                        isCorrect
                      ) {
                        optionClass =
                          "border-green-500 bg-green-500/10";
                      } else if (
                        selectedAnswer === index &&
                        !isCorrect
                      ) {
                        optionClass =
                          "border-red-500 bg-red-500/10";
                      }

                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() =>
                            handleQuizAnswer(index)
                          }
                          disabled={
                            selectedAnswer !== null
                          }
                          className={`w-full rounded-xl border p-4 text-left text-sm transition ${optionClass}`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(
                              65 + index
                            )}
                            .
                          </span>{" "}
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

                      {
                        quizQuestions[
                          currentQuestion
                        ].explanation
                      }

                    </p>

                  </div>

                )}

                {selectedAnswer !== null && (

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
                  >
                    {currentQuestion <
                    quizQuestions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </button>

                )}

              </div>
            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* IMAGE ANALYSIS */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div>

            <p className="text-sm font-medium text-indigo-400">
              Multimodal Learning
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              🖼️ Analyze an Image
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Upload a study image, equation, diagram, or handwritten
              problem and let LearnSphere AI explain it.
            </p>

          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5">

            <label className="block cursor-pointer">

              <span className="mb-2 block text-sm font-medium text-slate-300">
                Choose an image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {

                  const file =
                    e.target.files?.[0] || null;

                  setImageFile(file);
                  setImageAnalysis("");

                }}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-indigo-500"
              />

            </label>

            {imageFile && (

              <div className="mt-4">

                <p className="text-sm text-slate-400">
                  Selected image:
                </p>

                <p className="mt-1 break-all text-sm font-medium text-white">
                  {imageFile.name}
                </p>

                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={imageLoading}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {imageLoading
                    ? "Analyzing Image..."
                    : "Analyze Image"}
                </button>

              </div>

            )}

            {imageAnalysis && (

              <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5">

                <p className="mb-4 font-semibold text-indigo-300">
                  🤖 AI Analysis
                </p>

                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {imageAnalysis}
                </div>

              </div>

            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* UPLOAD MATERIAL */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div>

            <p className="text-sm font-medium text-indigo-400">
              Track D • Multimodal Knowledge Base
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              📚 Upload Learning Material
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Upload textbooks, lecture slides, text notes, or
              lecture videos and use them as source-grounded
              learning material.
            </p>

          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5">

            <label className="block cursor-pointer">

              <span className="mb-2 block text-sm font-medium text-slate-300">
                Choose learning material
              </span>

              <input
                type="file"
                accept=".txt,.pdf,.pptx,.mp4,.webm,.mov,.m4v"
                onChange={(e) => {

                  const file =
                    e.target.files?.[0] || null;

                  setMaterialFile(file);
                  setMaterialResult(null);
                  setMaterialQuestion("");
                  setMaterialAnswer("");
                  setMaterialSources([]);

                }}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-indigo-500"
              />

            </label>

            <p className="mt-2 text-xs text-slate-500">
              Supported formats: TXT, PDF, PPTX, MP4, WEBM, MOV, M4V
            </p>

            <p className="mt-1 text-xs text-indigo-400">
              🎥 Lecture videos are analyzed using Gemini multimodal AI.
            </p>

            {materialFile && (

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-sm font-medium text-white">
                  Selected material:
                </p>

                <p className="mt-1 break-all text-sm text-slate-400">
                  {materialFile.name}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Size:{" "}
                  {(materialFile.size / 1024 / 1024).toFixed(2)}
                  {" MB"}
                </p>

                <button
                  type="button"
                  onClick={handleUploadMaterial}
                  disabled={materialLoading}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {materialLoading
                    ? materialFile.name
                        .toLowerCase()
                        .endsWith(".mp4")
                      ? "Processing Lecture Video..."
                      : "Uploading Material..."
                    : "Upload & Extract Material"}
                </button>

              </div>

            )}

            {materialResult && (

              <>

                {/* MATERIAL SUCCESS */}

                <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5">

                  <p className="mb-4 font-semibold text-green-300">
                    {materialResult.file_type === "VIDEO"
                      ? "🎥 Lecture Video Processed Successfully"
                      : "📚 Material Extracted Successfully"}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">

                    <div className="rounded-lg bg-slate-950 p-3">

                      <p className="text-xs text-slate-500">
                        File
                      </p>

                      <p className="mt-1 break-all text-sm text-slate-300">
                        {materialResult.filename}
                      </p>

                    </div>

                    <div className="rounded-lg bg-slate-950 p-3">

                      <p className="text-xs text-slate-500">
                        Type
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {materialResult.file_type}
                      </p>

                    </div>

                    <div className="rounded-lg bg-slate-950 p-3">

                      <p className="text-xs text-slate-500">
                        Characters
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {materialResult.characters}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="mb-2 text-sm font-semibold text-white">
                      Extracted Learning Content
                    </p>

                    <div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {materialResult.text}
                    </div>

                  </div>

                  <p className="mt-4 text-sm text-green-400">
                    ✓ {materialResult.message}
                  </p>

                </div>

                {/* MATERIAL Q&A */}

                <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5">

                  <p className="mb-2 font-semibold text-indigo-300">
                    🤖 Ask About This Material
                  </p>

                  <p className="mb-4 text-sm leading-6 text-slate-400">
                    Ask a question and LearnSphere AI will answer
                    using your uploaded material and provide
                    source references.
                  </p>

                  <textarea
                    value={materialQuestion}
                    onChange={(e) =>
                      setMaterialQuestion(
                        e.target.value
                      )
                    }
                    placeholder="e.g. What is photosynthesis according to this material?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={handleAskFromMaterial}
                    disabled={
                      materialAskLoading ||
                      !materialQuestion.trim()
                    }
                    className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {materialAskLoading
                      ? "Finding Answer & Sources..."
                      : "Ask From Material"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleGenerateMaterialQuiz
                    }
                    disabled={materialQuizLoading}
                    className="mt-4 w-full rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-5 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {materialQuizLoading
                      ? "Generating Adaptive Material Quiz..."
                      : "📝 Generate Adaptive Quiz From This Material"}
                  </button>

                  {materialAnswer && (

                    <div className="mt-5 rounded-xl border border-indigo-500/30 bg-slate-950 p-5">

                      <p className="mb-3 font-semibold text-indigo-300">
                        📚 Answer From Your Material
                      </p>

                      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                        {materialAnswer}
                      </div>

                      {/* SOURCE CITATIONS */}

                      {materialSources.length > 0 && (

                        <div className="mt-6 border-t border-slate-800 pt-5">

                          <p className="mb-3 font-semibold text-indigo-300">
                            🔎 Sources & References
                          </p>

                          <div className="space-y-3">

                            {materialSources.map(
                              (source, index) => (

                                <div
                                  key={index}
                                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                                >

                                  <p className="text-sm font-semibold text-white">
                                    📍{" "}
                                    {source.location}
                                  </p>

                                  <p className="mt-2 text-sm leading-6 text-slate-400">
                                    “
                                    {
                                      source.evidence
                                    }
                                    ”
                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              </>

            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* LEARNING HISTORY */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-indigo-400">
                Your Progress
              </p>

              <h3 className="mt-1 text-2xl font-semibold">
                Learning History
              </h3>

            </div>

            {chatHistory.length > 0 && (

              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Clear History
              </button>

            )}

          </div>

          {chatHistory.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-slate-800 bg-slate-950 p-6 text-center">

              <p className="text-sm text-slate-500">
                Your learning questions will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {chatHistory.map(
                (item, index) => (

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

                    <p className="mt-4 font-semibold text-white">
                      Q: {item.question}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                      {item.answer}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

      {/* FOOTER */}

      <footer className="border-t border-slate-800 bg-slate-950">

        <div className="mx-auto max-w-6xl px-6 py-8 text-center">

          <p className="font-semibold text-white">
            LearnSphere AI
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your personalized learning companion
          </p>

          <p className="mt-3 text-xs text-slate-600">
            AI Learning • Personalized • Multimodal • Interactive
          </p>

        </div>

      </footer>

    </main>
  );
}