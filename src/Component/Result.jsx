import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Style/Result.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userEmail =
    user?.email ||
    user?.userEmail ||
    localStorage.getItem("userEmail") ||
    "N/A";

  return (
    <div className="email-popup-overlay">
      <div className="email-popup">

        <div className="email-icon">
          📧
        </div>

        <h2>Result Sent Successfully!</h2>

        <p>
          Your result has been sent to:
        </p>

        <strong>{userEmail}</strong>

        <button
          className="btn-primary"
          onClick={() => navigate("/home")}
        >
          OK
        </button>

      </div>
    </div>
  );
};

export default Result;