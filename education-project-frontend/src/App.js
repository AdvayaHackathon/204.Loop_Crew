import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./components/HomePage";
import AdminSignIn from "./components/AdminSignIn";
import AdminSignUp from "./components/AdminSignUp";
import AdminDashboard from "./components/AdminDashboard";
import CreateClass from "./components/CreateClass";
import AddStudent from "./components/AddStudent";
import ViewStudents from "./components/ViewStudents";
import AboutPage from "./components/AboutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Admin Auth */}
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />

        {/* Admin Features */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-class" element={<CreateClass />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/classes/:classId/students" element={<ViewStudents />} />
        
      </Routes>
    </Router>
  );
}

export default App;
