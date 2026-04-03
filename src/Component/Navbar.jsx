import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Style/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection logic for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`modern-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        
        {/* Logo Section */}
        <div className="nav-logo">
          <NavLink to="/home" onClick={closeMenu}>
            <img 
              src="/Images/logo.png" 
              alt="Brand Logo" 
              className="logo-img"
            />
          </NavLink>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div 
          className={`menu-icon ${menuOpen ? "open" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links-container ${menuOpen ? "active" : ""}`}>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link" onClick={closeMenu}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className="nav-link" onClick={closeMenu}>
                Services
              </NavLink>
            </li>
            <li className="nav-item mobile-only">
               {/* Mobile mein button list ke andar dikhega */}
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </NavLink>
            </li>
          </ul>

          {/* Login Button (Desktop) */}
          <div className="nav-btn-wrapper desktop-only">
            <NavLink to="/login">
              <button className="glow-btn">
                <span>Login</span>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;