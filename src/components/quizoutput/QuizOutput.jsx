import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizOutput.css";

const QuizOutput = ({ correctCount, total, difficulty, onReview }) => {
  const navigate = useNavigate();
  return (
    <div className="quizoutput-container">
      <div className="quizoutput-card">
        <div className="quizoutput-icon">✔️</div>
        <h2 className="quizoutput-title">Quiz Complete!</h2>
        <div className="quizoutput-score">
          {Math.round((correctCount / total) * 100)}%
        </div>
        <div className="quizoutput-desc">
          {correctCount} out of {total} correct
        </div>
        <div className="quizoutput-stats-row">
          <div className="quizoutput-stat">
            <div className="quizoutput-stat-value">{correctCount}</div>
            <div className="quizoutput-stat-label">Correct</div>
          </div>
          <div className="quizoutput-stat">
            <div className="quizoutput-stat-value">{total - correctCount}</div>
            <div className="quizoutput-stat-label">Incorrect</div>
          </div>
          <div className="quizoutput-stat">
            <div className="quizoutput-stat-value">{difficulty}</div>
            <div className="quizoutput-stat-label">Difficulty</div>
          </div>
        </div>
        <div className="quizoutput-actions">
          <button
            className="quizoutput-btn quizoutput-btn-dark"
            onClick={() => navigate("/")}
          >
            Return Home
          </button>
          <button
            className="quizoutput-btn quizoutput-btn-light"
            onClick={onReview}
          >
            Review Answers
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizOutput;
