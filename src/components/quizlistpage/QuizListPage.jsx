import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizListPage.css";

const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"];

const QuizListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All Difficulties");
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");

  const filteredQuizzes = quizzes.filter((q) => {
    const s = search.toLowerCase();
    const diffMatch =
      difficulty === "All Difficulties" || q.difficulty === difficulty;
    return (
      diffMatch &&
      (q.topic.toLowerCase().includes(s) ||
        q.language.toLowerCase().includes(s) ||
        q.difficulty.toLowerCase().includes(s))
    );
  });

  return (
    <div className="quizlist-container">
      <div className="quizlist-header-row">
        <button className="quizlist-back" onClick={() => navigate("/")}>
          {"<"} Back to Home
        </button>
      </div>
      <h1 className="quizlist-title">Browse Quizzes</h1>
      <p className="quizlist-subtitle">
        Discover and take quizzes from our library
      </p>
      <div className="quizlist-filters">
        <input
          className="quizlist-search"
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="quizlist-datefilter" disabled>
          Date Created
        </button>
        <select
          className="quizlist-difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="quizlist-count">
        Showing {filteredQuizzes.length} of {quizzes.length} quizzes
      </div>
      <div className="quizlist-grid">
        {filteredQuizzes.length === 0 ? (
          <div className="quizlist-empty">No quizzes found.</div>
        ) : (
          filteredQuizzes.map((q) => {
            // Check if quiz is completed (results exist)
            const results = localStorage.getItem(`quiz_results_${q.id}`);
            return (
              <div
                key={q.id}
                className="quizlist-card"
                onClick={() => {
                  if (results) {
                    navigate(`/review?id=${q.id}`);
                  } else {
                    navigate(`/passquiz?id=${q.id}`);
                  }
                }}
              >
                <div className="quizlist-card-top">
                  <span
                    className={`quizlist-badge quizlist-badge-${q.difficulty.toLowerCase()}`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="quizlist-questions">
                    {q.questions.length} questions
                  </span>
                </div>
                <div className="quizlist-card-title">{q.topic} Assessment</div>
                <div className="quizlist-card-desc">
                  A {q.difficulty.toLowerCase()} level quiz covering {q.topic}{" "}
                  concepts in {q.language}.
                </div>
                <div className="quizlist-card-meta">
                  <span>Topic: {q.topic}</span>
                  <span>{new Date(q.created).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuizListPage;
