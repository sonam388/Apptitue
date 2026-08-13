import React, { useState } from 'react';
import { useAuth } from './Auth';
import './Style/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State to toggle between Login and Signup view
  const [isLoginView, setIsLoginView] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset form when switching views
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setName('');
  };

  // --- HANDLE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // /signup",signup );
    // router.post("/login"
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const user = response.data;
      const token = response.data.token
      console.log(user)
      const previousUserId = localStorage.getItem("userId");

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("userEmail", user.userEmail);
      localStorage.setItem("userName", user.userName);

      if (previousUserId && previousUserId !== user._id) {
        localStorage.removeItem("examHistory");
      }

      setUserName(user.name || user.email);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        login(token);
        navigate("/streem");
      }, 2500);

    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      });

      if (res.status === 200 || res.status === 201) {
        alert('Account created successfully! Please login.');
        setIsLoginView(true); // Switch to login view automatically
      }
    } catch (error) {
      console.error(error);
      alert('Registration Failed: User might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* ===== WELCOME POPUP ===== */}
      {showPopup && (
        <div className="welcome-popup-overlay">
          <div className="welcome-popup">
            <div className="popup-avatar">✓</div>
            <div className="popup-tag">Login Successful</div>
            <h2>Welcome back!</h2>
            <p className="popup-name">Hello, <span>{userName}</span> 👋</p>
            <div className="popup-bar-wrap">
              <div className="popup-bar"></div>
            </div>
          </div>
        </div>
      )}



      {/* LEFT SIDE - FORM SECTION */}
      <div className="login-left">
        <div className="login-header fade-in">
          <div className="logo-brand">
            <span className="brand-dot"></span> Apptitute
          </div>

          {/* Dynamic Heading */}
          <h1>{isLoginView ? "Welcome back" : "Create Account"}</h1>
          <p>
            {isLoginView
              ? "Please enter your details to sign in."
              : "Start your journey with us today."}
          </p>
        </div>

        <form onSubmit={isLoginView ? handleLogin : handleSignup} className="login-form fade-in">

          {/* Show Name Input ONLY for Signup */}
          {!isLoginView && (
            <div className="input-group slide-up">
              <label>Full Name</label>
              <div className="input-wrapper">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember Me - Only for Login */}
          {isLoginView && (
            <div className="form-actions">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <span className="spinner"></span> : (isLoginView ? "Sign In" : "Sign Up")}
          </button>

          {/* Toggle Link */}
          <p className="signup-text">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleView} className="signup-link">
              {isLoginView ? "Sign up for free" : "Log in"}
            </span>
          </p>
        </form>

        <div className="login-footer">
          <p>© 2025 Apptitute Inc.</p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE/ART (Remains Same) */}
      <div className="login-right">
        <div className="image-overlay">
          <div className="quote-box">
            <p>"{isLoginView ? "Success is the sum of small efforts, repeated day in and day out." : "The secret of getting ahead is getting started."}"</p>
            <span>- {isLoginView ? "Robert Collier" : "Mark Twain"}</span>
          </div>
        </div>
        <img
          src={isLoginView
            ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Visual"
          className="bg-image"
        />
      </div>

    </div>
  )
}

export default Login;