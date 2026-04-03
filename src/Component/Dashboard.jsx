import React, { useEffect, useState } from "react";
import "./Style/dash.css";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [examHistory, setExamHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("examHistory")) || [];
    setExamHistory(history);
  }, []);

  const totalTests = examHistory.length;
  const bestScore = totalTests > 0 ? Math.max(...examHistory.map((t) => parseFloat(t.percentage) || 0)) : 0;
  const avgScore = totalTests > 0 ? (examHistory.reduce((acc, t) => acc + (parseFloat(t.percentage) || 0), 0) / totalTests).toFixed(1) : 0;

  const progressData = examHistory.map((t, index) => ({
    name: `Test ${index + 1}`,
    score: parseFloat(t.percentage),
    date: t.date.split(",")[0],
  }));

  const skillData = [
    { subject: "Logic", A: 80, fullMark: 100 },
    { subject: "Verbal", A: 65, fullMark: 100 },
    { subject: "Quant", A: 90, fullMark: 100 },
    { subject: "GK", A: 70, fullMark: 100 },
    { subject: "Tech", A: 85, fullMark: 100 },
  ];

  // 🏆 Grade Colors for Light Mode (Darker shades for readability)
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'S', color: '#7c3aed', bg: '#f3e8ff', label: 'Master' }; // Purple
    if (percentage >= 80) return { grade: 'A', color: '#059669', bg: '#d1fae5', label: 'Excellent' }; // Green
    if (percentage >= 60) return { grade: 'B', color: '#2563eb', bg: '#dbeafe', label: 'Good' }; // Blue
    if (percentage >= 40) return { grade: 'C', color: '#d97706', bg: '#fef3c7', label: 'Average' }; // Amber
    return { grade: 'F', color: '#dc2626', bg: '#fee2e2', label: 'Fail' }; // Red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="clean-tooltip">
          <p className="label">Score</p>
          <p className="value">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="light-dashboard">
      <div className="dash-content">
        {/* Header */}
        <header className="header-clean">
          <div className="header-left">
            <h1>Overview</h1>
            <p>Hi, Welcome back! Here's your progress.</p>
          </div>
          <div className="date-pill">{new Date().toDateString()}</div>
        </header>

        {/* 🍱 Modern Grid */}
        <div className="bento-grid">
          
          {/* KPI Cards */}
          <div className="card kpi-card">
            <div className="icon-box blue">📝</div>
            <div>
              <p className="kpi-label">Total Tests</p>
              <h2 className="kpi-value">{totalTests}</h2>
            </div>
          </div>
          <div className="card kpi-card">
            <div className="icon-box green">🏆</div>
            <div>
              <p className="kpi-label">Best Score</p>
              <h2 className="kpi-value">{bestScore}%</h2>
            </div>
          </div>
          <div className="card kpi-card">
            <div className="icon-box purple">⚡</div>
            <div>
              <p className="kpi-label">Average</p>
              <h2 className="kpi-value">{avgScore}%</h2>
            </div>
          </div>

          {/* 📈 Main Chart (Blue Gradient) */}
          <div className="card chart-main">
            <div className="card-header">
              <h3>Performance History</h3>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1' }} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fill="url(#colorBlue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🕸️ Radar Chart */}
          <div className="card chart-side">
            <div className="card-header">
              <h3>Skill Analysis</h3>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                  <Radar name="Skills" dataKey="A" stroke="#0ea5e9" strokeWidth={2} fill="#0ea5e9" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 📜 History List (Clean White Tiles) */}
          <div className="card history-section">
            <div className="card-header">
              <h3>Recent Results</h3>
            </div>
            <div className="history-list">
              {examHistory.length === 0 ? (
                <div className="empty-msg">No tests taken yet.</div>
              ) : (
                [...examHistory].reverse().map((test, idx) => {
                   const { grade, color, bg, label } = getGrade(test.percentage);
                   return (
                    <div key={idx} className="history-row">
                      <div className="grade-badge" style={{ backgroundColor: bg, color: color }}>
                        {grade}
                      </div>
                      <div className="row-info">
                        <h4>{test.date.split(',')[0]}</h4>
                        <span className="status-label">{label}</span>
                      </div>
                      <div className="row-score">
                        <span style={{color: color}}>{test.percentage}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 💡 Insights (Soft Cards) */}
          <div className="card insights-section">
             <div className="card-header">
              <h3>Smart Insights</h3>
             </div>
             <div className="insight-container">
               <div className="insight-item">
                  <span className="dot blue"></span>
                  <p><strong>Consistent!</strong> You've improved 10% this week.</p>
               </div>
               <div className="insight-item">
                  <span className="dot orange"></span>
                  <p><strong>Tip:</strong> Spend more time on 'Reasoning'.</p>
               </div>
               <div className="insight-item">
                  <span className="dot green"></span>
                  <p><strong>Great Speed:</strong> Your avg time is optimal.</p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;