

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./Style/Exam.css";

const MediumExam = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [theme, setTheme] = useState("light"); // ✅ light / dark
  const navigate = useNavigate();

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get("https://apptitute-backend.onrender.com/api/question");
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // remember preference
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);
// ✅ Handle Option Select
  const handleOptionChange = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };
 // ✅ Submit Exam
  const handleSubmit = () => {
    const total = questions.length;
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) correctCount++;
    });
    const percentage = ((correctCount / total) * 100).toFixed(2);
    const isPass = percentage >= 60;

    const examHistory = JSON.parse(localStorage.getItem("examHistory")) || [];
    examHistory.push({
      date: new Date().toLocaleString(),
      score: correctCount,
      total,
      percentage,
      isPass,
    });
    localStorage.setItem("examHistory", JSON.stringify(examHistory));

    navigate("/result", {
      state: {
        questions,
        answers,
      },
    });
  };

  return (
    <div className={`exam-container ${theme}`}>
      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button> 
      <h1>🧠 Aptitude Test</h1>

      {questions.map((q, qIndex) => (
        <div className="question-card" key={qIndex}>
          <h2 className="ques">Q{qIndex + 1}. {q.question}</h2>
          {q.options.map((opt, optIndex) => (
            <label key={optIndex} className="option-label">
              <input
                type="radio"
                name={`question-${qIndex}`}
                value={optIndex}
                checked={answers[qIndex] === optIndex}
                onChange={() => handleOptionChange(qIndex, optIndex)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit}>Submit Exam ✅</button>
    </div>
  );
};

export default MediumExam;
