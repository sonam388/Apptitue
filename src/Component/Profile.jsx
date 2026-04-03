import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Style/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
      setLoading(false);
    }, 800);
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotoURL = URL.createObjectURL(file);
      setUser({ ...user, photo: newPhotoURL });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
  if (!user) return null;

  return (
    <div className="profile-wrapper">
      
      {/* Main Card Container - Centered */}
      <div className="profile-card">
        
        {/* --- HEADER --- */}
        <div className="profile-header">
          <div className="cover-photo">
            {/* Professional Desk Cover */}
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80" alt="Cover" />
          </div>
          
          <div className="profile-identity">
            <div className="avatar-wrapper">
              <img 
                src={user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                alt="Profile" 
                className="avatar-img" 
              />
              <label htmlFor="photo-upload" className="camera-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </label>
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} hidden />
            </div>

            <div className="user-info">
              <h1 className="username">{user.name}</h1>
              <p className="user-role">Student / Aspirant</p>
              <div className="badges">
                <span className="badge pro">PRO Member</span>
                <span className="badge verified">Verified</span>
              </div>
            </div>

            <div className="header-btn-group">
               <button className="btn-outline" onClick={() => setActiveTab('settings')}>Edit Profile</button>
               <button className="btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <div className="tabs-container">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="content-body">
          {activeTab === 'overview' ? (
            <div className="overview-section">
              
              {/* REAL IMAGE STAT CARDS */}
              <div className="stats-grid">
                
                <div className="image-card">
                  <div className="card-img-holder">
                    <img src="https://images.unsplash.com/photo-1456324504439-367cee114747?auto=format&fit=crop&w=200&q=80" alt="Tests" />
                  </div>
                  <div className="card-text">
                    <h3>12</h3>
                    <p>Mock Tests</p>
                  </div>
                </div>

                <div className="image-card">
                  <div className="card-img-holder">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80" alt="Analytics" />
                  </div>
                  <div className="card-text">
                    <h3>85%</h3>
                    <p>Avg. Score</p>
                  </div>
                </div>

                <div className="image-card">
                  <div className="card-img-holder">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&q=80" alt="Team" />
                  </div>
                  <div className="card-text">
                    <h3>Active</h3>
                    <p>Account Status</p>
                  </div>
                </div>
              </div>

              {/* DETAILED INFO TABLE */}
              <div className="details-container">
                <h3>Personal Details</h3>
                <div className="details-row">
                   <div className="detail-group">
                     <label>Full Name</label>
                     <div className="value-box">{user.name}</div>
                   </div>
                   <div className="detail-group">
                     <label>Email Address</label>
                     <div className="value-box">{user.email}</div>
                   </div>
                   <div className="detail-group">
                     <label>User ID</label>
                     <div className="value-box blur">{user._id}</div>
                   </div>
                   <div className="detail-group">
                     <label>Joining Date</label>
                     <div className="value-box">{new Date().toLocaleDateString()}</div>
                   </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="settings-section">
               <h3>Account Settings</h3>
               <p>Update your password and personal details.</p>
               <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                 <div className="form-input-group">
                   <label>Change Name</label>
                   <input type="text" defaultValue={user.name} />
                 </div>
                 <div className="form-input-group">
                   <label>New Password</label>
                   <input type="password" placeholder="Leave empty to keep current" />
                 </div>
                 <button className="btn-primary">Save Changes</button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;