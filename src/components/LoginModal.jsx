import React, { useState } from "react";
import "./LoginModal.css";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const getUsers = () => {
  const users = localStorage.getItem("quizUsers");
  return users ? JSON.parse(users) : [];
};

const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("quizUsers", JSON.stringify(users));
};

const LoginModal = ({ onLogin, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  React.useEffect(() => {
    setSuggestions(getUsers().map((u) => u.email));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (isSignup) {
      const newUser = {
        id: generateId(),
        email,
        password,
      };
      saveUser(newUser);
      localStorage.setItem("quizUser", JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const users = getUsers();
      const found = users.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        localStorage.setItem("quizUser", JSON.stringify(found));
        onLogin(found);
      } else {
        setError("Invalid credentials or user not found.");
      }
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="login-title">{isSignup ? "Sign Up" : "Sign In"}</h2>
        <p className="login-desc">
          {isSignup
            ? "Create your QuizMaster Pro account"
            : "Access your QuizMaster Pro account"}
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
            list="email-suggestions"
          />
          <datalist id="email-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="login-error">{error}</div>}
          <button className="login-submit" type="submit">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="login-switch">
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsSignup(false)}>
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button type="button" onClick={() => setIsSignup(true)}>
                Sign up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
