import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonPositions, setButtonPositions] = useState({
    home: { x: 0, y: 0, escaped: false },
    back: { x: 0, y: 0, escaped: false },
    search: { x: 0, y: 0, escaped: false },
  });
  const [glitchText, setGlitchText] = useState("404");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const glitchTexts = ["404", "40₺", "4Ø4", "₄0₄", "4🔍4", "40🚫"];
    const glitchInterval = setInterval(() => {
      setGlitchText(
        glitchTexts[Math.floor(Math.random() * glitchTexts.length)]
      );
    }, 150);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleButtonHover = (buttonName) => {
    const container = containerRef.current?.getBoundingClientRect();

    if (!container) return;

    const maxX = container.width - 120;
    const maxY = container.height - 50;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setButtonPositions((prev) => ({
      ...prev,
      [buttonName]: {
        x: newX,
        y: newY,
        escaped: true,
      },
    }));

    setTimeout(() => {
      setButtonPositions((prev) => ({
        ...prev,
        [buttonName]: { x: 0, y: 0, escaped: false },
      }));
    }, 3000);
  };

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setClickCount(0);
    }
  };

  const FloatingButton = ({ name, children, delay = 0, onClick }) => {
    const pos = buttonPositions[name];
    // Prevent escape animation for the home button
    const handleMouseEnter =
      name === "home" ? undefined : () => handleButtonHover(name);
    return (
      <button
        className={`floating-button ${
          pos.escaped && name !== "home" ? "escaped" : ""
        }`}
        style={{
          transform:
            pos.escaped && name !== "home"
              ? `translate(${pos.x}px, ${pos.y}px)`
              : "translate(0, 0)",
          animationDelay: `${delay}s`,
        }}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
      >
        {children}
        <span className="button-tail">💨</span>
      </button>
    );
  };

  return (
    <div className="not-found-container" ref={containerRef}>
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      <div className="content">
        <div className="glitch-container" onClick={handleLogoClick}>
          <h1 className="glitch-text">{glitchText}</h1>
          <div className="glitch-overlay">404</div>
          <div className="glitch-overlay">404</div>
        </div>

        <div className="error-message">
          <h2 className="wobble">Oops! This page went on vacation 🏖️</h2>
          <p className="typewriter">
            It seems like this page packed its bags and left for a tropical
            island.
            <br />
            We've sent a search party with sunscreen and flip-flops! 🕵️‍♂️
          </p>
        </div>

        <div className="buttons-container">
          <FloatingButton name="home" delay={0} onClick={() => navigate("/")}>
            🏠 Go Home
          </FloatingButton>
          <FloatingButton name="back" delay={0.2}>
            ⬅️ Go Back
          </FloatingButton>
          <FloatingButton name="search" delay={0.4}>
            🔍 Search
          </FloatingButton>
        </div>

        <div className="fun-facts">
          <div className="fun-fact">
            <span className="fact-emoji">🤖</span>
            <span>
              Fun fact: This error message is powered by{" "}
              {Math.floor(Math.random() * 100)}% pure confusion!
            </span>
          </div>
          <div className="fun-fact">
            <span className="fact-emoji">📊</span>
            <span>
              Mouse position: X:{Math.round(mousePosition.x)}, Y:
              {Math.round(mousePosition.y)}
            </span>
          </div>
        </div>

        {showEasterEgg && (
          <div className="easter-egg">
            <div className="easter-egg-content">
              🎉 You found the secret! 🎉
              <br />
              Here's a virtual cookie: 🍪
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;
