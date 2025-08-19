import React, { useState } from "react";
import "./CreateQuiz.css";

const LANGUAGES = ["English", "Spanish", "French", "German", "Chinese"];
const QUESTION_COUNTS = [
  "5 Questions",
  "10 Questions",
  "15 Questions",
  "20 Questions",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const CreateQuiz = ({ onClose }) => {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [count, setCount] = useState(QUESTION_COUNTS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //  handle quiz creation logic later
    onClose();
  };

  return (
    <div className="createquiz-modal-overlay">
      <div className="createquiz-modal">
        <button className="createquiz-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="createquiz-title">Create New Quiz</h2>
        <p className="createquiz-desc">
          Configure your AI-generated quiz parameters
        </p>
        <form className="createquiz-form" onSubmit={handleSubmit}>
          <label>Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., JavaScript Fundamentals, World History, Biology"
            required
          />
          <div className="createquiz-row">
            <div className="createquiz-col">
              <label>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="createquiz-col">
              <label>Number of Questions</label>
              <select value={count} onChange={(e) => setCount(e.target.value)}>
                {QUESTION_COUNTS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div className="createquiz-col">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label>Special Requirements (Optional)</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Any specific focus areas, question types, or requirements..."
            rows={2}
          />
          <button className="createquiz-submit" type="submit">
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
