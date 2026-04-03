import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Style/Exam.css";

const Exam = () => {

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.userId)

  const queryParams = new URLSearchParams(location.search);
  const stream = queryParams.get("stream");
  const level = queryParams.get("level");
  const course = queryParams.get("course");

  // 🔄 FETCH QUESTIONS
  useEffect(() => {

    const fetchQuestions = async () => {
      try {

        let url = `https://apptitute-backend-final.onrender.com/api/questions?stream=${stream}&level=${level}`;

        const res = await axios.get(url);

        const formatted = res.data.map(q => ({
          ...q,
          options: q.type === "mcq" && q.options ? JSON.parse(q.options) : []
        }));

        setQuestions(formatted);

      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    if (stream && level) fetchQuestions();

  }, [stream, level, course]);

  // MCQ
  const handleOptionSelect = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  // WRITTEN
  const handleWrittenAnswer = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  // SUBMIT
  const handleFinishExam = async () => {

    setIsSubmitting(true);

    let mcqScore = 0;
    let writtenAnswers = [];

    questions.forEach((q, i) => {

      if (q.type === "mcq") {

        if (
          answers[i] &&
          q.correctAnswer &&
          answers[i].toString().trim().toLowerCase() ===
          q.correctAnswer.toString().trim().toLowerCase()
        ) {
          mcqScore++;
        }

      }

      else if (q.type === "coding" || q.type === "written") {

        writtenAnswers.push({
          question: q.question,
          userAnswer: answers[i] || "",
          correctAnswer: q.correctAnswer || ""
        });

      }

    });

    try {

      // 🔥 WRITTEN TEST SEND TO ADMIN
      if (writtenAnswers.length > 0) {

        await axios.post(
          "https://apptitute-backend-final.onrender.com/api/admin/submit-written",
          {
            userId: user.userId,
            stream,
            level,
            answers: writtenAnswers,
            score: mcqScore
          }
        );

        alert("Written Test Sent To Admin For Review!");

        navigate("/result", {
          state: {
            message: "Written Test Submitted Successfully. Admin Will Evaluate Soon."
          }
        });

        return;
      }

      // ONLY MCQ
      const percentage = ((mcqScore / questions.length) * 100).toFixed(2);
      const isPass = Number(percentage) >= 60;

      const history = JSON.parse(localStorage.getItem("examHistory")) || [];

      const newRecord = {
        date: new Date().toLocaleString(),
        score: mcqScore,
        total: questions.length,
        percentage,
        isPass,
        stream,
        level,
        course
      };

      localStorage.setItem("examHistory", JSON.stringify([...history, newRecord]));

      navigate("/result", {
        state: { questions, answers }
      });

    } catch (err) {

      console.error("Submission Error:", err);
      alert("Error submitting written test");

    }

    setIsSubmitting(false);

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

  if (questions.length === 0) {
    return <div className="loader">Loading Test...</div>;
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
              <textarea
                placeholder="Write your answer here..."
                className="coding-box"
                value={answers[qIndex] || ""}
                onChange={(e) => handleWrittenAnswer(qIndex, e.target.value)}
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