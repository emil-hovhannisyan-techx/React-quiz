import React, { useState, useEffect } from "react";
import { Brain, Users, Trophy, TrendingUp } from "lucide-react";
import LoginModal from "./LoginModal";
import CreateQuiz from "./CreateQuiz";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleCreateQuizClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowCreateQuiz(true);
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Enterprise AI Quiz Platform</h1>
        <p className="homepage-description">
          Harness the power of artificial intelligence to create, manage, and
          analyze professional quizzes. Built for enterprise-scale learning and
          assessment.
        </p>
        <button
          className="homepage-create-quiz"
          onClick={handleCreateQuizClick}
        >
          + Create Quiz
        </button>
      </div>
      <div className="homepage-features-section">
        <h2 className="homepage-features-title">Enterprise Features</h2>
        <div className="homepage-features-row">
          <div className="homepage-feature-card">
            <Brain
              className="homepage-feature-icon"
              size={40}
              color="#5b7cff"
            />
            <h3 className="homepage-feature-title">AI-Powered</h3>
            <p className="homepage-feature-desc">
              Advanced AI generates contextual questions based on your
              specifications
            </p>
          </div>
          <div className="homepage-feature-card">
            <Users
              className="homepage-feature-icon"
              size={40}
              color="#5b7cff"
            />
            <h3 className="homepage-feature-title">Multi-Language</h3>
            <p className="homepage-feature-desc">
              Create quizzes in multiple languages for global teams
            </p>
          </div>
          <div className="homepage-feature-card">
            <Trophy
              className="homepage-feature-icon"
              size={40}
              color="#5b7cff"
            />
            <h3 className="homepage-feature-title">Performance Analytics</h3>
            <p className="homepage-feature-desc">
              Detailed insights and performance tracking for all assessments
            </p>
          </div>
          <div className="homepage-feature-card">
            <TrendingUp
              className="homepage-feature-icon"
              size={40}
              color="#5b7cff"
            />
            <h3 className="homepage-feature-title">Scalable Platform</h3>
            <p className="homepage-feature-desc">
              Enterprise-grade infrastructure supporting unlimited users
            </p>
          </div>
        </div>
      </div>
      <div className="homepage-stats-row">
        <div className="stats-item">
          <span className="stats-value">10M+</span>
          <span className="stats-label">Quizzes Created</span>
        </div>
        <div className="stats-item">
          <span className="stats-value">500K+</span>
          <span className="stats-label">Active Users</span>
        </div>
        <div className="stats-item">
          <span className="stats-value">99.9%</span>
          <span className="stats-label">Uptime SLA</span>
        </div>
      </div>
      {showLogin && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
      {showCreateQuiz && (
        <CreateQuiz onClose={() => setShowCreateQuiz(false)} />
      )}
    </div>
  );
};

export default HomePage;
