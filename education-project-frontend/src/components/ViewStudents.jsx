import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // 👈 Get route params
import "./ViewStudents.css";

const API_URL = "http://localhost:5000/api/classes";

const ViewStudents = () => {
  const { classId } = useParams(); // 👈 classId from URL
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
      fetchStudents();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/${classId}`);
      setClassName(res.data.class_username); // adjust based on actual response
    } catch (err) {
      console.error("Error fetching class details:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/${classId}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  return (
    <div className="view-students-container">
      <h2>Students in {className}</h2>
      {students.length > 0 ? (
        <div className="students-list">
          {students.map((student, idx) => (
            <div key={idx} className="student-card">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No students enrolled in this class.</p>
      )}
    </div>
  );
};

export default ViewStudents;
