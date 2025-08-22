import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import QuizQuestions from "./QuizQuestions";
import QuizOutput from "./QuizOutput";
import "./PassQuizPage.css";

const PassQuizPage = () => {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("id");
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch quiz from localStorage by ID
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return <div className="passquiz-notfound">Quiz not found.</div>;
  }

  // Calculate results
  let correctCount = 0;
  if (submitted) {
    correctCount = quiz.questions.reduce((acc, q, idx) => {
      return acc + (q.options[answers[idx]] === q.correctAnswer ? 1 : 0);
    }, 0);
    // Save results to localStorage
    localStorage.setItem(
      `quiz_results_${quizId}`,
      JSON.stringify({
        answers,
        correctCount,
        completedAt: new Date().toISOString(),
      })
    );
  }

  return (
    <div className="passquiz-container">
      <div className="passquiz-header">
        <button className="passquiz-back-btn" onClick={() => navigate("/")}>
          &larr; Back to Home
        </button>
        <h1 className="passquiz-title">{quiz.topic} Assessment</h1>
        <p className="passquiz-desc">
          A {quiz.difficulty.toLowerCase()} level quiz covering {quiz.topic}{" "}
          concepts in {quiz.language}.
        </p>
      </div>
      {!submitted && (
        <QuizQuestions
          questions={quiz.questions}
          onSubmit={(userAnswers) => {
            setAnswers(userAnswers);
            setSubmitted(true);
          }}
        />
      )}
      {submitted && (
        <QuizOutput
          correctCount={correctCount}
          total={quiz.questions.length}
          difficulty={quiz.difficulty}
          onReview={() => navigate(`/review?id=${quizId}`)}
        />
      )}
    </div>
  );
};

export default PassQuizPage;
