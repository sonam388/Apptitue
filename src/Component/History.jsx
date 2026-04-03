import React, { useEffect, useState } from 'react';
import './Style/History.css';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("examHistory")) || [];
    // Reverse taaki latest test sabse pehle dikhe
    setHistory(stored.reverse());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all history?")) {
      localStorage.removeItem("examHistory");
      setHistory([]);
    }
  };

  // 🎨 Helper for Progress Bar Color
  const getColor = (percent) => {
    if (percent >= 80) return '#10b981'; // Green
    if (percent >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className='history-page'>
      <div className='history-container'>
        
        {/* Header Section */}
        <header className='hist-header'>
          <div className='header-left'>
            <button className='back-btn' onClick={() => navigate("/exam")}>
              ← Back
            </button>
            <div className='title-box'>
              <h1>Attempt History</h1>
              <p>Your past performance archive</p>
            </div>
          </div>
          
          {history.length > 0 && (
            <button className='clear-btn' onClick={handleClearHistory}>
              🗑 Clear All
            </button>
          )}
        </header>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>📭</div>
            <h2>No Records Found</h2>
            <p>You haven't taken any tests yet.</p>
            <button className='primary-btn' onClick={() => navigate("/exam")}>
              Start a Quiz Now
            </button>
          </div>
        ) : (
          /* Grid of Cards */
          <div className='history-grid'>
            {history.map((exam, index) => {
              const themeColor = getColor(exam.percentage);
              
              return (
                <div key={index} className='history-card'>
                  {/* Card Top: Date & Badge */}
                  <div className='card-top'>
                    <span className='date-badge'>
                      📅 {exam.date.split(',')[0]}
                    </span>
                    <span className={`status-pill ${exam.isPass ? 'pass' : 'fail'}`}>
                      {exam.isPass ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  {/* Card Middle: Score Info */}
                  <div className='card-mid'>
                    <div className='score-circle' style={{borderColor: themeColor}}>
                      <span className='score-num' style={{color: themeColor}}>
                        {exam.percentage}%
                      </span>
                    </div>
                    <div className='score-details'>
                      <p>Score: <strong>{exam.score} / {exam.total}</strong></p>
                      <p className='result-text' style={{color: themeColor}}>
                        {exam.isPass ? "Great Job! 🎉" : "Keep Trying 💪"}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Progress Bar */}
                  <div className='card-bottom'>
                    <div className='progress-track'>
                      <div 
                        className='progress-fill' 
                        style={{ width: `${exam.percentage}%`, background: themeColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;