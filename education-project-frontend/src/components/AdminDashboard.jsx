import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/classes";

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  // Fetch all classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API_URL);
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const handleStudentList = (classId) => {
    navigate(`/admin/classes/${classId}/students`);
  };

  const handleCreateClass = () => {
    navigate("/admin/create-class");
  };

  const handleAddStudent = () => {
    navigate("/admin/add-student");
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <div className="buttons">
          <button className="create-btn" onClick={handleCreateClass}>
            Create New Class
          </button>
          <button className="add-btn" onClick={handleAddStudent}>
            Add Student
          </button>
        </div>
      </div>

      <div className="classes-list">
        {classes.map((cls) => (
          <div key={cls._id} className="class-card">
            <div className="class-info">
              <h3>{cls.name}</h3>
              <p><strong>PDF:</strong> {cls.pdfName}</p>
              <p><strong>Students:</strong> {cls.students.length}</p>
            </div>

            <button className="view-btn" onClick={() => handleStudentList(cls._id)}>
              View Students
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
