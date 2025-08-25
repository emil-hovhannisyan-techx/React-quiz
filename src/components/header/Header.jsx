import React, { useState } from "react";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../loginmodal/LoginModal";
import useUser from "../../context/useUser";
import "./Header.css";

const Header = () => {
  const { user, login, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    login(userData);
    setShowLogin(false);
  };

  return (
    <header className="app-header">
      <nav className="header-wrapper">
        <div className="quiz-title">
          <Brain />
          QuizMaster Pro
        </div>
        {user ? (
          <div className="welcome-text">
            Welcome,{" "}
            <span className="username">{user.email.split("@")[0]}</span>
            <button className="browse-btn" onClick={() => navigate("/quizzes")}>
              Browse Quizzes
            </button>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Log In
          </button>
        )}
      </nav>
      {showLogin && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </header>
  );
};

export default Header;
