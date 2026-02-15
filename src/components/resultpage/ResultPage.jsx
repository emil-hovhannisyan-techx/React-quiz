import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";
import QuizQuestions from "../quizquestions/QuizQuestions";
import QuizOutput from "../quizoutput/QuizOutput";
import "./ResultPage.css";

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
        // Save quiz to localStorage if not already saved
        if (quizData && quizData.quiz) {
          const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
          // Generate a unique ID for the quiz
          const quizId = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          quizzes.push({
            id: quizId,
            topic: quizData.quiz.topic,
            language: quizData.quiz.language,
            difficulty: quizData.quiz.difficulty,
            created: new Date().toISOString(),
            questions: quizData.quiz.questions,
          });
          localStorage.setItem("quizzes", JSON.stringify(quizzes));
          // Redirect to passquiz page with quizId
          navigate(`/passquiz?id=${quizId}`);
        }
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
    <div className="resultpage-container">
      <div className="resultpage-header">
        <button className="resultpage-back-btn" onClick={() => navigate("/")}>
          &larr; Back to Home
        </button>
        {quizData && quizData.quiz && (
          <>
            <h1 className="resultpage-title">
              {quizData.quiz.topic} Assessment
            </h1>
            <p className="resultpage-desc">
              A {quizData.quiz.difficulty.toLowerCase()} level quiz covering{" "}
              {quizData.quiz.topic} concepts in {quizData.quiz.language}.
            </p>
          </>
        )}
        {isLoading && <p className="resultpage-loading">Loading...</p>}
        {error && <p className="resultpage-error">Error: {error.message}</p>}
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
