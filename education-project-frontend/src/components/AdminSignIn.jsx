import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const AdminSignIn = () => {
  const [credentials, setCredentials] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sign-in successful!");
        navigate("/admin/dashboard"); // ✅ Redirect after login
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Network error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Sign In</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
        <p>
          Don’t have an account? <Link to="/admin/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignIn;
