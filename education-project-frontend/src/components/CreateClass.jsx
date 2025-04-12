import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateClass.css";


const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className || !pdfFile) {
      return alert("Please fill out all fields");
    }

    const formData = new FormData();
    formData.append("name", className);
    formData.append("pdf", pdfFile);

    try {
      await axios.post("http://localhost:5000/api/classes", formData);
      alert("Class created successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating class", error);
      alert("Error creating class. Try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Class</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />
        <button type="submit">Create Class</button>
      </form>
    </div>
  );
};

export default CreateClass;
