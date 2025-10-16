/**
 * Navigation Component
 * 
 * A responsive navigation bar with mobile hamburger menu support.
 * Handles routing between different pages of the Learn Buddy application.
 * 
 * @component
 * @example
 * return <Navbar />
 */

import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Handle Features click - scroll to features section
  const handleFeaturesClick = (e) => {
    e.preventDefault();
    closeMenu();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToFeatures();
      }, 100);
    } else {
      // Already on home page, just scroll
      scrollToFeatures();
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-preview');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠", type: "link" },
    { path: "#features", label: "Features", icon: "✨", type: "scroll", onClick: handleFeaturesClick },
    { path: "/settings", label: "Settings", icon: "⚙️", type: "link" }
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="logo-icon">🎓</span>
        My Learn Buddy
      </div>

      {/* Navigation Links */}
      <div className="navbar-right">
        <div className={`navbar-links ${isOpen ? "show" : ""}`}>
          {navItems.map((item) => (
            item.type === "scroll" ? (
              <a
                key={item.path}
                href={item.path}
                className="nav-link"
                onClick={item.onClick}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className="nav-link"
                onClick={closeMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;