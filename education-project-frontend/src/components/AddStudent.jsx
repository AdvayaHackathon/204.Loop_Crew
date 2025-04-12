import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddStudent.css";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classes/list");


        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes", err);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !classId) {
      return alert("Please fill out all fields");
    }

    try {
      await axios.post(`http://localhost:5000/api/classes/${classId}/students`, {
        name,
        phone,
      });
      alert("Student added successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding student", error);
      alert("Error adding student. Try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
  <option value="">Select Class</option>
  {classes.map((cls) => (
    <option key={cls.class_id} value={cls.class_id}>
      {cls.class_username}
    </option>
  ))}
</select>

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
