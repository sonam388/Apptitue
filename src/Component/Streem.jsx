import React from 'react';
import { Link } from 'react-router-dom';
import './Style/Streem.css';

const Streem = () => {
  return (
    <div className="stream-wrapper">

      <div className="header-section">
        <span className="subtitle">Start Your Journey</span>
        <h1 className="title">Select Your Path 🚀</h1>
        <p className="description">Choose a specialization to begin your assessment.</p>
      </div>

      <div className="boxc">

        {/* MERN */}
        <div className="stream-card easy">
          <Link className="card-link" to="/category/MERN">
            <div className="card-content">
              <h3>MERN Stack</h3>
              <p>MongoDB, Express, React, Node</p>
              <span className="arrow-btn">Start Test →</span>
            </div>
          </Link>
        </div>

        {/* PYTHON */}
        <div className="stream-card medium">
          <Link className="card-link" to="/category/PYTHON">
            <div className="card-content">
              <h3>Python Dev</h3>
              <p>Core Python, Django</p>
              <span className="arrow-btn">Start Test →</span>
            </div>
          </Link>
        </div>

        {/* DATA SCIENCE */}
        <div className="stream-card hard">
          <Link className="card-link" to="/category/DATASCIENCE">
            <div className="card-content">
              <h3>Data Science</h3>
              <p>ML, AI, Pandas</p>
              <span className="arrow-btn">Start Test →</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Streem;