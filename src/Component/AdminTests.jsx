import React, { useEffect, useState } from "react";
import API from "../api/Axios";
import "../Style/Admintest.css";

export default function AdminTests() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    API.get("/admin/tests").then(res => setTests(res.data));
  }, []);

  return (
    <div className="admin-container">
      <h2>Pending Reviews</h2>
      <div style={{marginTop: '20px'}}>
        {tests.map(t => (
          <div key={t._id} className="test-item">
            <div>
              <p style={{margin: 0, fontWeight: 'bold'}}>User ID: {t.userId}</p>
              <small style={{color: '#666'}}>Attempted on: {new Date(t.createdAt).toLocaleDateString()}</small>
            </div>
            <div>
              <span className={`status-badge ${t.status === 'pending' ? 'pending' : 'evaluated'}`}>
                {t.status.toUpperCase()}
              </span>
            </div>
            <button className="view-btn">Review Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}