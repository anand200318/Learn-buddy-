import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo">My Learn Buddy</div>

      {/* Right: Links + Hamburger */}
      <div className="navbar-right">
        {/* Links */}
        <div className={`navbar-links ${isOpen ? "show" : ""}`}>
          <NavLink to="/" className="nav-link">
             Home
          </NavLink>
          <NavLink to="/settings" className="nav-link">
             Settings
          </NavLink>
        </div>

        {/* Hamburger menu (visible only on mobile) */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
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
