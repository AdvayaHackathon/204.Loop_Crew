import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">EduConnect</h1>
          <ul className="nav-links">
            
            <li><Link to="/about">About</Link></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/admin/signin">Admin</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h2>Bridging the Gap in Rural Education</h2>
          <p>Personalized learning resources for rural students — anytime, anywhere.</p>
          <Link to="/admin/signup" className="cta-button">Admin Sign Up</Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
