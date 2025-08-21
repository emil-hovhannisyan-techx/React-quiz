import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";
import QuizQuestions from "./QuizQuestions";
import QuizOutput from "./QuizOutput";

const fetcher = async (url, apiKey, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }
  return res.json();
};

const ResultPage = () => {
  const location = useLocation();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const quizRequest = location.state?.quizRequest;

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const { data, error, isLoading } = useSWR(
    quizRequest
      ? [
          API_URL,
          API_KEY,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are a professional quiz generator. 
                            Generate a quiz with the following parameters:

                            Topic: ${quizRequest.topic}
                            Language: ${quizRequest.language}
                            Number of Questions: ${quizRequest.count}
                            Difficulty: ${quizRequest.difficulty}
                            Special Requirements: ${
                              quizRequest.requirements || "None"
                            }

                            The output MUST strictly follow this JSON schema:

                            {
                              "quiz": {
                                "topic": "string",
                                "language": "string",
                                "difficulty": "string",
                                "questions": [
                                  {
                                    "question": "string",
                                    "options": ["string", "string", "string", "string"],
                                    "correctAnswer": "string",
                                    "explanation": "string"
                                  }
                                ]
                              }
                            }
                            Return ONLY valid JSON. Do not include explanations outside of JSON.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          },
        ]
      : null,
    ([url, key, body]) => fetcher(url, key, body),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  // parsing quiz json from response
  let quizData = null;
  if (data) {
    try {
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResponse) {
        quizData = JSON.parse(textResponse);
      }
    } catch (err) {
      console.error("Failed to parse quiz JSON:", err);
    }
  }

  // Handle submit
  const handleSubmit = (userAnswers) => {
    setAnswers(userAnswers);
    setSubmitted(true);
  };

  // Calculate results
  let correctCount = 0;
  if (submitted && quizData) {
    correctCount = quizData.quiz.questions.reduce((acc, q, idx) => {
      return acc + (q.options[answers[idx]] === q.correctAnswer ? 1 : 0);
    }, 0);
  }

  return (
    <div
      className="resultpage-container"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f7f8fa",
        minHeight: "100vh",
        padding: "0 0 48px 0",
      }}
    >
      <div
        className="resultpage-header"
        style={{
          textAlign: "left",
          margin: "48px auto 24px auto",
          maxWidth: "700px",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#222",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "18px",
          }}
          onClick={() => navigate("/")}
        >
          &larr; Back to Home
        </button>
        {quizData && quizData.quiz && (
          <>
            <h1
              style={{
                color: "#18181b",
                fontSize: "2.1rem",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              {quizData.quiz.topic} Assessment
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "1.08rem",
                marginBottom: "18px",
              }}
            >
              A {quizData.quiz.difficulty.toLowerCase()} level quiz covering{" "}
              {quizData.quiz.topic} concepts in {quizData.quiz.language}.
            </p>
          </>
        )}
        {isLoading && (
          <p style={{ color: "#5b7cff", fontSize: "1.2rem", fontWeight: 600 }}>
            Loading...
          </p>
        )}
        {error && (
          <p style={{ color: "#e53e3e", fontSize: "1.1rem", fontWeight: 600 }}>
            Error: {error.message}
          </p>
        )}
      </div>
      {quizData && quizData.quiz && !submitted && (
        <QuizQuestions
          questions={quizData.quiz.questions}
          onSubmit={handleSubmit}
        />
      )}
      {quizData && quizData.quiz && submitted && (
        <QuizOutput
          correctCount={correctCount}
          total={quizData.quiz.questions.length}
          difficulty={quizData.quiz.difficulty}
          onReview={() => setSubmitted(false)}
        />
      )}
    </div>
  );
};

export default ResultPage;
