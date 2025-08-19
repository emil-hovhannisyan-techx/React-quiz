import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import LoginModal from "./LoginModal";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("quizUser");
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
            <button className="logout-btn" onClick={handleLogout}>
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
