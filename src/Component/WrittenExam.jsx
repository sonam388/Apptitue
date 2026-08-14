import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "./Style/Exam.css";
import API from "../api/Axios";

const WrittenExam = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const language = searchParams.get("stream");

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId || user?._id;

  const queryParams = new URLSearchParams(location.search);
  const stream = queryParams.get("stream");
  const level = queryParams.get("level");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/questions?stream=${stream}&level=${level}`);
        const written = res.data.filter(
          (q) => q.type === "written" || q.type === "coding"
        );
        if (written.length === 0) {
          setError("No written questions found for this stream/level.");
        }
        setQuestions(written);
      } catch {
        setError("Failed to load questions. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    if (stream && level) fetchQuestions();
    else { setError("Invalid URL: stream or level missing."); setLoading(false); }
  }, [stream, level]);

  const handleFinishExam = async () => {
    setIsSubmitting(true);
    try {
      const payload = questions.map((q, i) => ({
        question: q.question,
        userAnswer: answers[i] || "",
      }));

      await API.post("/test/ai-evaluate", { userId, answers: payload, stream, level });

      navigate("/result", { state: { questions, answers } });
    } catch (err) {
      alert("Error submitting test: " + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) { handleFinishExam(); return; }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (loading) return <div className="loader">Loading Test...</div>;

  if (error) return (
    <div className="loader" style={{ flexDirection: "column", gap: "16px" }}>
      <p style={{ color: "#ff6b6b" }}>{error}</p>
      <button onClick={() => window.history.back()} style={{ padding: "8px 20px", cursor: "pointer" }}>Go Back</button>
    </div>
  );

  return (
    <div className="simple-exam-page">

      <header className="sticky-header">
        <div className="header-content">
          <div className="brand">{stream} - {level} Test</div>
          <div className={`timer-badge ${timeLeft < 60 ? "danger" : ""}`}>
            ⏳ {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="question-container">
        {questions.map((q, qIndex) => (
          <div key={q._id || qIndex} className="question-card">
            <h3>Q{qIndex + 1}. {q.question}</h3>
            <Editor
              height="300px"
              defaultLanguage={language === "MERN" ? "javascript" : "python"}
              className="coding-box"
              value={answers[qIndex] || ""}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [qIndex]: value }))}
              theme="vs-dark"
            />
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

export default WrittenExam;
