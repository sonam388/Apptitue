import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Style/Result.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Safe destructuring with fallback
  const { questions, answers } = state || { questions: [], answers: {} };

  if (!questions || questions.length === 0) {
    return (
      <div className="error-container">
        <h2>No Data Found 😢</h2>
        <button className="btn-primary" onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  // Logic Calculations
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const resultData = questions.map((q, i) => {
    const userAnswer = answers[i];
    const isCorrect = q.correctAnswer === userAnswer;
    const isSkipped = userAnswer === undefined || userAnswer === null;

    if (isCorrect) correctCount++;
    else if (!isSkipped) wrongCount++;
    else skippedCount++;

    return {
      id: i + 1,
      question: q.question,
      selected: isSkipped ? "Skipped" : q.options[userAnswer],
      correct: q.options[q.correctAnswer],
      status: isCorrect ? "correct" : isSkipped ? "skipped" : "wrong",
    };
  });

  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const isPass = percentage >= 60;

  return (
    <div className="result-wrapper">
      <div className={`result-card ${animate ? "slide-up" : ""}`}>
        
        {/* --- HEADER SECTION --- */}
        <div className="result-header">
          <div className="score-ring-container">
            <div 
              className="score-ring" 
              style={{ background: `conic-gradient(${isPass ? '#10b981' : '#ef4444'} ${percentage * 3.6}deg, #e2e8f0 0deg)` }}
            >
              <div className="score-inner">
                <span className="score-text">{percentage}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
          </div>
          
          <div className="result-summary">
            <span className={`status-badge ${isPass ? "pass" : "fail"}`}>
              {isPass ? "🎉 Passed" : "❌ Failed"}
            </span>
            <h1>{isPass ? "Excellent Work!" : "Keep Practicing!"}</h1>
            <p>You answered <strong>{correctCount}</strong> out of <strong>{total}</strong> questions correctly.</p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="stats-grid">
          <div className="stat-box correct">
            <div className="icon">✅</div>
            <div>
              <h3>{correctCount}</h3>
              <p>Correct</p>
            </div>
          </div>
          <div className="stat-box wrong">
            <div className="icon">❌</div>
            <div>
              <h3>{wrongCount}</h3>
              <p>Wrong</p>
            </div>
          </div>
          <div className="stat-box skipped">
            <div className="icon">⏭️</div>
            <div>
              <h3>{skippedCount}</h3>
              <p>Skipped</p>
            </div>
          </div>
        </div>

        {/* --- DETAILED ANALYSIS --- */}
        <div className="analysis-section">
          <h3>Detailed Analysis</h3>
          <div className="question-list">
            {resultData.map((r, i) => (
              <div key={i} className={`q-card ${r.status}`}>
                <div className="q-header">
                  <span className="q-num">Q{r.id}</span>
                  <span className={`q-badge ${r.status}`}>{r.status.toUpperCase()}</span>
                </div>
                <p className="q-text">{r.question}</p>
                
                <div className="q-answers">
                  <div className="ans-row">
                    <span className="label">Your Answer:</span>
                    <span className={`value ${r.status}`}>{r.selected}</span>
                  </div>
                  {!r.status.includes("correct") && (
                    <div className="ans-row">
                      <span className="label">Correct Answer:</span>
                      <span className="value correct-text">{r.correct}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="result-footer">
          <button className="btn-secondary" onClick={() => navigate("/home")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </button>
          <button className="btn-primary" onClick={() => navigate("/")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
            Retake Test
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;