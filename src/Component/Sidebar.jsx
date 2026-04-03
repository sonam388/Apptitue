import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './Auth';
import './Style/Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Helper to check active class
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* 📱 Mobile Toggle Button (Visible only on mobile) */}
      <div className="mobile-header-strip">
        <button className="mobile-toggle-btn" onClick={toggleSidebar}>
          <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <span className="mobile-logo">AptiMaster</span>
      </div>

      {/* 🌑 Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
        onClick={closeSidebar}
      ></div>

      {/* 🟢 Sidebar Container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-icon">
            <i className="fa fa-graduation-cap"></i>
          </div>
          <div className="logo-text">
            <h2>Apti<span className="highlight">Master</span></h2>
            <p>Student Portal</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="nav-container">
          <ul className="nav-list">
            {[
              { path: '/streem', icon: 'fa-home', label: 'Home' },
              { path: '/profile', icon: 'fa-user', label: 'Profile' },
              { path: '/dashboard', icon: 'fa-tachometer', label: 'Dashboard' },
              { path: '/testpage', icon: 'fa-file-text', label: 'Test Zone' },
              { path: '/history', icon: 'fa-history', label: 'History' },
              { path: '/result', icon: 'fa-certificate', label: 'Results' },
            ].map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path)}`} 
                  onClick={closeSidebar}
                >
                  <i className={`fa ${item.icon} nav-icon`}></i>
                  <span className="nav-text">{item.label}</span>
                  {/* Optional: Arrow indicator for active link */}
                  {isActive(item.path) && <i className="fa fa-chevron-right arrow-indicator"></i>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa fa-power-off"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;