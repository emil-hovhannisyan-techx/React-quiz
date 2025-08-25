import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./QuizReviewPage.css";

const QuizReviewPage = () => {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("id");
  const navigate = useNavigate();

  // Fetch quiz and results from localStorage
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
  const quiz = quizzes.find((q) => q.id === quizId);
  const results = JSON.parse(
    localStorage.getItem(`quiz_results_${quizId}`) || "null"
  );

  if (!quiz || !results) {
    return (
      <div className="quizreview-notfound">Quiz or results not found.</div>
    );
  }

  const correctCount = results.correctCount;
  const total = quiz.questions.length;
  const score = Math.round((correctCount / total) * 100);

  return (
    <div className="quizreview-container">
      <div className="quizreview-header-row">
        <button
          className="quizreview-back"
          onClick={() => navigate("/quizzes")}
        >
          {"<"} Back to Search
        </button>
        <span
          className={`quizreview-badge quizreview-badge-${quiz.difficulty.toLowerCase()}`}
        >
          {quiz.difficulty}
        </span>
      </div>
      <h1 className="quizreview-title">{quiz.topic} Assessment</h1>
      <p className="quizreview-subtitle">
        A {quiz.difficulty.toLowerCase()} level quiz covering {quiz.topic}{" "}
        concepts in {quiz.language}.
      </p>
      <div className="quizreview-meta-row">
        <div className="quizreview-meta">
          <span className="quizreview-meta-label">{total}</span>
          <span className="quizreview-meta-desc">Questions</span>
        </div>
        <div className="quizreview-meta">
          <span className="quizreview-meta-label">{quiz.topic}</span>
          <span className="quizreview-meta-desc">Topic</span>
        </div>
        <div className="quizreview-meta">
          <span className="quizreview-meta-label">
            {new Date(quiz.created).toLocaleDateString()}
          </span>
          <span className="quizreview-meta-desc">Created</span>
        </div>
        <div className="quizreview-meta">
          <span className="quizreview-meta-label quizreview-score">
            {score}%
          </span>
          <span className="quizreview-meta-desc">Your Score</span>
        </div>
      </div>
      <div className="quizreview-questions">
        {quiz.questions.map((q, idx) => {
          const userAnswerIdx = results.answers[idx];
          return (
            <div key={idx} className="quizreview-question-card">
              <div className="quizreview-question-header">
                <span className="quizreview-question-number">{idx + 1}</span>
                <span className="quizreview-question-title">
                  {q.question} (Question {idx + 1})
                </span>
              </div>
              <div className="quizreview-options">
                {q.options.map((opt, optIdx) => {
                  const isUser = userAnswerIdx === optIdx;
                  const isRight = opt === q.correctAnswer;
                  return (
                    <div
                      key={optIdx}
                      className={`quizreview-option${
                        isRight ? " quizreview-option-correct" : ""
                      }${isUser && !isRight ? " quizreview-option-wrong" : ""}`}
                    >
                      {opt}
                      {isRight && (
                        <span className="quizreview-icon quizreview-icon-correct">
                          &#10003;
                        </span>
                      )}
                      {isUser && !isRight && (
                        <span className="quizreview-icon quizreview-icon-wrong">
                          &#10007;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="quizreview-explanation">
                <span className="quizreview-explanation-label">
                  &#9432; Explanation
                </span>
                <span className="quizreview-explanation-text">
                  {q.explanation}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="quizreview-performance">
        <div className="quizreview-performance-title">Your Performance</div>
        <div className="quizreview-performance-row">
          <span className="quizreview-performance-score">{score}%</span>
          <span className="quizreview-performance-correct">
            {correctCount} Correct
          </span>
          <span className="quizreview-performance-wrong">
            {total - correctCount} Incorrect
          </span>
          <span className="quizreview-performance-total">
            {total} Total Questions
          </span>
        </div>
        <div className="quizreview-performance-date">
          Completed on{" "}
          {results.completedAt
            ? new Date(results.completedAt).toLocaleString()
            : "-"}
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;
