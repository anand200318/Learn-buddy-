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
import { NavLink } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/text-to-speech", label: "Text to Speech", icon: "🎤" },
    { path: "/settings", label: "Settings", icon: "⚙️" }
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
            <NavLink
              key={item.path}
              to={item.path}
              className="nav-link"
              onClick={closeMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
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