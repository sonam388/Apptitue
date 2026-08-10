import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
// import axios from "../api/Axios";
import './Style/AdminPanel.css';
import axios from "axios";
import { GrUserAdmin } from "react-icons/gr";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingTests, setPendingTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filters, setFilters] = useState({ stream: "", level: "", type: "" });
  const [testQuestions, setTestQuestions] = useState({}); // Store questions for each test
  const [loadingQuestions, setLoadingQuestions] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Form state for add/edit
  const [formData, setFormData] = useState({
    stream: "",
    level: "easy",
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  });

  // Fetch pending tests
  const fetchPending = async () => {
    try {
      const res = await axios.get("https://apptitute-backend-final.onrender.com/api/admin/pending-tests");
      const tests = res.data;
      setPendingTests(tests);

      // Fetch questions for tests that don't have answers stored (old tests)
      for (const test of tests) {
        if (!test.answers || test.answers.length === 0) {
          setLoadingQuestions(prev => ({ ...prev, [test._id]: true }));
          try {
            // Fetch questions based on stream and level
            const stream = test.stream || 'MERN';
            const level = test.level;
            const qRes = await axios.get(`https://apptitute-backend-final.onrender.com/api/questions?stream=${stream}&level=${level}`);
            setTestQuestions(prev => ({
              ...prev,
              [test._id]: qRes.data
            }));
          } catch (err) {
            console.error("Failed to fetch questions for test:", test._id);
          } finally {
            setLoadingQuestions(prev => ({ ...prev, [test._id]: false }));
          }
        }
      }
    } catch (err) {
      alert("Error fetching pending tests");
    }
  };

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("https://apptitute-backend-final.onrender.com/api/admin/getfullq");
      setQuestions(res.data.questions || res.data);
      setFilteredQuestions(res.data.questions || res.data);
    } catch (err) {
      alert("Error fetching questions");
    }
  };

  useEffect(() => {
    fetchPending();
    fetchQuestions();
  }, []);

  // Filter questions
  useEffect(() => {
    let filtered = questions;
    if (filters.stream) {
      filtered = filtered.filter(q => q.stream.toLowerCase() === filters.stream.toLowerCase());
    }
    if (filters.level) {
      filtered = filtered.filter(q => q.level.toLowerCase() === filters.level.toLowerCase());
    }
    if (filters.type) {
      filtered = filtered.filter(q => q.type.toLowerCase() === filters.type.toLowerCase());
    }
    setFilteredQuestions(filtered);
  }, [filters, questions]);

  const handleEvaluate = async (attemptId, score) => {
    try {
      if (!score && score !== 0) return alert("Please enter a score first!");
      await axios.post("https://apptitute-backend-final.onrender.com/api/admin/evaluate", { attemptId, manualScore: score });
      alert("Evaluation saved!");
      fetchPending();
    } catch (err) {
      alert("Evaluation failed!");
    }
  };

  const handleAddQuestion = async () => {
    try {
      const data = { ...formData };
      if (data.type === "mcq") {
        data.options = data.options.filter(o => o.trim() !== "");
      } else {
        delete data.options;
        delete data.correctAnswer;
      }
      await axios.post("https://apptitute-backend-final.onrender.com/api/admin/questions", data);
      alert("Question added successfully!");
      setShowAddForm(false);
      resetForm();
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add question");
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      const data = { ...formData };
      if (data.type === "mcq") {
        data.options = data.options.filter(o => o.trim() !== "");
      } else {
        data.options = [];
        data.correctAnswer = "";
      }
      await axios.put(`https://apptitute-backend-final.onrender.com/api/admin/questions/${editingQuestion._id}`, data);
      alert("Question updated successfully!");
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update question");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`https://apptitute-backend-final.onrender.com/api/admin/questions/${id}`);
        alert("Question deleted successfully!");
        fetchQuestions();
      } catch (err) {
        alert("Failed to delete question", err);
      }
    }
  };

  const editQuestion = (q) => {
    setEditingQuestion(q);
    setFormData({
      stream: q.stream,
      level: q.level,
      type: q.type,
      question: q.question,
      options: q.options || ["", "", "", ""],
      correctAnswer: q.correctAnswer || ""
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      stream: "",
      level: "easy",
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  console.log(pendingTests)

  return (
    <div className="admin-container">
      <h1 className="admin-title"><GrUserAdmin /> Admin Dashboard</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <MdOutlinePendingActions /> Pending Tests ({pendingTests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          <FaQuestionCircle /> Question Management ({questions.length})
        </button>
      </div>

      {/* Pending Tests Tab */}
      {activeTab === "pending" && (
        <div className="tab-content">
          <h2>Pending Test Reviews</h2>

          {/* Search Bar */}
          <div className="pending-search-bar">
            <input
              type="text"
              placeholder="🔍 Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="search-input"
            />
            {(searchName || searchDate) && (
              <button className="clear-search-btn" onClick={() => { setSearchName(""); setSearchDate(""); }}>✕ Clear</button>
            )}
          </div>

          {pendingTests.length === 0 ? (
            <p className="empty-state">✅ No tests pending review</p>
          ) : (
            pendingTests
              .filter((test) => {
                const nameMatch = searchName === "" || (test.userId?.name || "").toLowerCase().includes(searchName.toLowerCase());
                const dateMatch = searchDate === "" || new Date(test.createdAt).toLocaleDateString("en-CA") === searchDate;
                return nameMatch && dateMatch;
              })
              .map((test) => (
              <div key={test._id} className="test-card">
                <div className="test-header">
                  {console.log(test)}
                  <h4>👤 {test.userId?.name || "Unknown"}</h4>
                  <div className="test-meta">
                    <span className="badge stream">{test.stream}</span>
                    <span className="badge level">{test.level}</span>
                    <span className="badge status">{test.status}</span>
                  </div>
                </div>

                <div className="questions-review">
                  {test.answers && test.answers.length > 0 ? (
                    <>
                      {/* NEW TEST - Show questions with user answers */}
                      {test.answers.map((ans, idx) => (
                        <div key={idx} className="question-review-item">
                          <div className="question-number">Question {idx + 1}</div>
                          <div className="question-review-content">
                            <p className="review-question-text"><FaQuestionCircle /> {ans.questionText || ans.question}</p>

                            {/* For MCQ questions - show options with user selection and correct answer */}
                            {ans.type === "mcq" ? (
                              <>
                                {ans.options && ans.options.length > 0 ? (
                                  <div className="mcq-options">
                                    {ans.options.map((opt, i) => {
                                      const isUserAnswer = opt === (ans.userAnswer || ans.answer);
                                      const isCorrectAnswer = opt === ans.correctAnswer;
                                      let className = "mcq-option";
                                      if (isCorrectAnswer) className += " correct";
                                      if (isUserAnswer && !isCorrectAnswer) className += " wrong";
                                      if (isUserAnswer && isCorrectAnswer) className += " user-correct";

                                      return (
                                        <div key={i} className={className}>
                                          {isUserAnswer && "👉 "} {opt}
                                          {isCorrectAnswer && " ✅ (Correct)"}
                                          {isUserAnswer && !isCorrectAnswer && " ❌ (Wrong)"}
                                          {!isUserAnswer && !isCorrectAnswer && ""}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="answer-summary">
                                    <div className="answer-row">
                                      <span className="label">User Selected:</span>
                                      <span className={`value ${ans.isCorrect ? "correct" : "wrong"}`}>
                                        {ans.userAnswer || ans.answer || "No answer"} {ans.isCorrect ? "✅" : "❌"}
                                      </span>
                                    </div>
                                    <div className="answer-row">
                                      <span className="label">Correct Answer:</span>
                                      <span className="value correct">{ans.correctAnswer}</span>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              // For written questions - show user's answer and correct answer
                              <div className="written-answer">
                                <div className="answer-label">✍️ User's Answer:</div>
                                <div className="answer-text">{ans.userAnswer || ans.answer || "No answer provided"}</div>
                                {ans.correctAnswer && (
                                  <>
                                    <div className="answer-label">✅ Model Answer (for reference):</div>
                                    <div className="correct-answer-text">{ans.correctAnswer}</div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Result indicator */}
                            <div className="result-indicator">
                              {ans.type === "mcq" ? (
                                ans.isCorrect !== undefined ? (
                                  ans.isCorrect ? (
                                    <span className="correct-badge">✅ Correct Answer</span>
                                  ) : (
                                    <span className="wrong-badge">❌ Wrong Answer</span>
                                  )
                                ) : (
                                  <span className="pending-badge">⏳ Needs Review</span>
                                )
                              ) : (
                                <span className="pending-badge">⏳ Needs Manual Review</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : testQuestions[test._id] && testQuestions[test._id].length > 0 ? (
                    <>
                      {/* OLD TEST - Show questions from database (no user answers stored) */}
                      <div className="old-test-notice">
                        ⚠️ Old Test - Questions fetched from database (user answers not stored)
                      </div>
                      {testQuestions[test._id].map((q, idx) => (
                        <div key={q.id || q._id || idx} className="question-review-item">
                          <div className="question-number">Question {idx + 1}</div>
                          <div className="question-review-content">
                            <p className="review-question-text">❓ {q.question}</p>

                            {q.type === "mcq" && q.options && q.options.length > 0 ? (
                              <div className="mcq-options">
                                {q.options.map((opt, i) => (
                                  <div key={i} className={`mcq-option ${opt === q.correctAnswer ? "correct" : ""}`}>
                                    {opt === q.correctAnswer && "✅ "} {opt}
                                    {opt !== q.correctAnswer && opt}
                                  </div>
                                ))}
                              </div>
                            ) : q.type === "written" ? (
                              <div className="written-answer">
                                {q.correctAnswer && (
                                  <>
                                    <div className="answer-label">✅ Model Answer:</div>
                                    <div className="correct-answer-text">{q.correctAnswer}</div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="written-answer">
                                <p className="no-answer-label">No model answer available</p>
                              </div>
                            )}

                            <div className="result-indicator">
                              <span className="pending-badge">⏳ No user answer - Needs Manual Evaluation</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : loadingQuestions[test._id] ? (
                    <div className="empty-state">
                      <p>⏳ Loading questions...</p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>⚠️ Could not load questions for this test.</p>
                      <p className="hint">Stream: {test.stream || "Unknown"} | Level: {test.level}</p>
                      <button
                        className="retry-btn"
                        onClick={() => fetchPending()}
                      >
                        🔄 Retry
                      </button>
                    </div>
                  )}
                </div>

                <div className="evaluate-section">
                  <div className="score-info">
                    <span>📚 Stream: {test.stream || "N/A"}</span>
                    <span className="divider">|</span>
                    <span>📊 Level: {test.level?.toUpperCase()}</span>
                    {test.answers && test.answers.length > 0 ? (
                      <>
                        <span className="divider">|</span>
                        <span>MCQ Score: {test.score || 0}</span>
                        <span className="divider">|</span>
                        <span>Questions Answered: {test.answers?.length || 0}</span>
                      </>
                    ) : testQuestions[test._id] && testQuestions[test._id].length > 0 ? (
                      <>
                        <span className="divider">|</span>
                        <span>Questions in Test: {testQuestions[test._id].length}</span>
                        <span className="warning-text">| Old test (no user answers)</span>
                      </>
                    ) : (
                      <span className="warning-text">| Old test - Question data unavailable</span>
                    )}
                  </div>
                  <div className="score-input-group">
                    <label>
                      {test.answers && test.answers.length > 0
                        ? `Enter Final Score (${test.answers.length} questions):`
                        : testQuestions[test._id] && testQuestions[test._id].length > 0
                          ? `Enter Score (${testQuestions[test._id].length} questions - old test):`
                          : "Enter Score:"}
                    </label>
                    <input
                      type="number"
                      placeholder="Score"
                      id={`score-${test._id}`}
                      className="score-input"
                    />
                    <button
                      onClick={() => {
                        const scoreInput = document.getElementById(`score-${test._id}`);
                        handleEvaluate(test._id, scoreInput?.value);

                      }}

                      className="btn-submit"
                    >
                      Submit Score
                    </button>
                    {console.log(test._id)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Question Management Tab */}
      {activeTab === "questions" && (
        <div className="tab-content">
          <div className="questions-header">
            <h2>Question Management</h2>
            <button
              className="btn-add"
              onClick={() => { setShowAddForm(true); resetForm(); setEditingQuestion(null); }}
            >
              <span className="add-icon"><IoMdAdd /></span> Add New Question
            </button>

          </div>

          {/* Filters */}
          <div className="filters">
            <select
              value={filters.stream}
              onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
              className="filter-select"
            >
              <option value="">All Streams</option>
              <option value="MERN">MERN</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="filter-select"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="mcq">MCQ</option>
              <option value="written">Written</option>
            </select>
          </div>

          {/* Questions List */}
          <div className="questions-list">
            {filteredQuestions.length === 0 ? (
              <p className="empty-state">No questions found</p>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q._id} className="question-item">
                  <div className="question-header">
                    <span className="badge stream">{q.stream}</span>
                    <span className="badge level">{q.level}</span>
                    <span className="badge type">{q.type}</span>
                  </div>
                  <p className="question-text">{q.question}</p>
                  {q.type === "mcq" && (
                    <div className="options">
                      {q.options?.map((opt, i) => (
                        <div key={i} className={`option-item ${opt === q.correctAnswer ? "correct" : ""}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="question-actions">
                    {console.log(q)}
                    <button onClick={() => editQuestion(q)} className="btn-edit"><FaEdit /> Edit</button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="btn-delete"><MdDeleteForever /> Delete</button>
                    {console.log()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => { setShowAddForm(false); setEditingQuestion(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="head-2">
              {editingQuestion ? (
                <>
                  ✏️ Edit Question
                </>
              ) : (
                <>
                  <span className="add-icon">
                    <IoMdAdd />
                  </span>
                  Add New Question
                  <button className="close-btn" onClick={() => setShowAddForm(false)}><IoMdClose /></button>

                </>
              )}
            </h2>
            <div className="first-row">
              <div className="form-group">
                <label>Stream <b>*</b></label>
                <br />
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  required
                >
                  <option value="">Select Stream</option>
                  <option value="MERN">MERN</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div className="form-group">
                <label>Level<b>*</b></label>
                <br />
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Type<b>*</b></label>
                <br />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="mcq">MCQ</option>
                  <option value="written">Written</option>
                </select>
              </div>
            </div>


            <div className="form-group">
              <label>Question <b>*</b></label>
              <br />
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter question here..."
                rows="3"
                required
              />
            </div>

            {formData.type === "mcq" && (
              <>
                <label>Options<b>*</b></label>

                <div className="options-container">
                  {formData.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="option-input"
                    />
                  ))}
                </div>
              </>
            )}



            <div className="form-group">
              <label>Correct Answer<b>*</b></label>
              <br />
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                required className="ans-sel"
              >
                <option value="">Select Correct Answer</option>
                {formData.options.filter(o => o.trim()).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>



            <div className="modal-actions">
              <button onClick={() => { setShowAddForm(false); setEditingQuestion(null); }} className="btn-cancel">
                Cancel
              </button>
              <button
                onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                className="btn-save"
              >
                {editingQuestion ? "Update" : "Add"} Question
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}
export default AdminPanel;
