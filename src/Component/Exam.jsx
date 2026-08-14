import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./Style/Exam.css";
import Editor from "@monaco-editor/react";
import BASE_URL from "../api/config";

const Exam = () => {

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParama] = useSearchParams()
  const language = searchParama.get("stream")

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId || user?._id;

  const queryParams = new URLSearchParams(location.search);
  const stream = queryParams.get("stream");
  const level = queryParams.get("level");
  const course = queryParams.get("course");

  // 🔄 FETCH QUESTIONS
  useEffect(() => {

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${BASE_URL}/api/questions?stream=${stream}&level=${level}`);

        const formatted = res.data.map(q => ({
          ...q,
          options: q.type === "mcq" && q.options
            ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options))
            : []
        }));

        if (formatted.length === 0) {
          setError("No questions found for this stream/level. Please contact admin.");
        }

        setQuestions(formatted);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load questions. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (stream && level) {
      fetchQuestions();
    } else {
      setError("Invalid URL: stream or level missing.");
      setLoading(false);
    }

  }, [stream, level, course]);

  // WRITTEN
  const handleWrittenAnswer = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  // SUBMIT
  const handleFinishExam = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const writtenAnswers = questions
        .filter(q => q.type === "coding" || q.type === "written")
        .map((q) => ({
          question: q.question,
          userAnswer: answers[questions.findIndex(x => x._id === q._id)] || "",
        }));

      let aiResult = null;
      if (writtenAnswers.length > 0) {
        const res = await axios.post(
          `${BASE_URL}/api/test/ai-evaluate`,
          { userId, answers: writtenAnswers, stream, level },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        aiResult = res.data;
      }

      navigate("/result", { state: { questions, answers, aiResult } });

    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error submitting test: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // TIMER
  useEffect(() => {

    if (timeLeft <= 0) {
      handleFinishExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="loader">Loading Test...</div>;
  }

  if (error) {
    return (
      <div className="loader" style={{ flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#ff6b6b" }}>{error}</p>
        <button onClick={() => window.history.back()} style={{ padding: "8px 20px", cursor: "pointer" }}>Go Back</button>
      </div>
    );
  }


  return (

    <div className="simple-exam-page">

      <header className="sticky-header">
        <div className="header-content">
          <div className="brand">{stream} - {level} Test</div>
          <div className={`timer-badge ${timeLeft < 60 ? 'danger' : ''}`}>
            ⏳ {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="question-container">

        {questions.map((q, qIndex) => (

          <div key={qIndex} className="question-card">

            <h3>Q{qIndex + 1}. {q.question}</h3>

            {q.type === "mcq" &&
              q.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className={`option-row ${answers[qIndex] === opt ? "selected" : ""}`}
                  onClick={() => handleOptionSelect(qIndex, opt)}
                >
                  {opt}
                </div>
              ))
            }

            {(q.type === "coding" || q.type === "written") && (
              <Editor
                height="300px"
                defaultLanguage={language == "MERN" ? "javascript" : "python"}
                placeholder="Write your answer here..."
                className="coding-box"
                value={answers[qIndex] || ""}
                onChange={(e) => handleWrittenAnswer(qIndex, e.target.value)}
                theme="vs-dark"
              />
            )}

          </div>

        ))}

        <button
          className="submit-btn-large"
          onClick={handleFinishExam}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Exam 🚀"}
        </button>

      </div>

    </div>
  );
};

export default Exam;