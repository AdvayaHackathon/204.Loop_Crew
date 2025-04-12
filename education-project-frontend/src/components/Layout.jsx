// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Layout.css"; // styling

const Layout = () => {
  return (
    <div className="layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">EduConnect</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/admin/signin">Admin</Link></li>
          </ul>
        </div>
      </nav>

      {/* Dynamic Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
