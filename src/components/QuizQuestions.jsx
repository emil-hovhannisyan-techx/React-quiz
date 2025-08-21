import React, { useState } from "react";
import "./QuizQuestions.css";

const QuizQuestions = ({ questions, onSubmit }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleSelect = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };
  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="quizquestions-container">
      <div className="quizquestions-card">
        <h2 className="quizquestions-title">
          {questions[current].question} (Question {current + 1})
        </h2>
        <div>
          {questions[current].options.map((opt, idx) => {
            const selected = answers[current] === idx;
            return (
              <label
                key={idx}
                className={`quizquestions-option${selected ? " selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`answer-${current}`}
                  checked={selected}
                  onChange={() => handleSelect(idx)}
                  style={{ display: "none" }}
                />
                <span className="quizquestions-radio" />
                {opt}
              </label>
            );
          })}
        </div>
        <div className="quizquestions-actions">
          <button
            className="quizquestions-btn quizquestions-btn-light"
            onClick={handlePrev}
            disabled={current === 0}
          >
            &larr; Previous
          </button>
          {current < questions.length - 1 ? (
            <button
              className="quizquestions-btn quizquestions-btn-dark"
              onClick={handleNext}
              disabled={answers[current] == null}
            >
              Next &rarr;
            </button>
          ) : (
            <button
              className="quizquestions-btn quizquestions-btn-blue"
              onClick={handleSubmit}
              disabled={answers[current] == null}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
