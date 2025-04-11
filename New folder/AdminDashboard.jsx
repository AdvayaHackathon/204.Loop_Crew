import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const AdminDashboard = () => {
  const [classes, setClasses] = useState(() => JSON.parse(localStorage.getItem("classes")) || []);
  const [newClass, setNewClass] = useState({ className: "", pdf: null });
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", classId: "" });

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  const handleCreateClass = () => {
    const { className, pdf } = newClass;
    if (!className || !pdf) return alert("Please provide class name and upload a PDF");
    if (classes.some(cls => cls.className === className)) return alert("Class name already exists");

    const newCls = {
      id: Date.now().toString(),
      className,
      pdfName: pdf.name,
      students: []
    };

    setClasses(prev => [...prev, newCls]);
    setNewClass({ className: "", pdf: null });
  };

  const handleAddStudent = () => {
    const { name, phone, classId } = studentForm;
    if (!name || !phone || !classId) return alert("Fill all student details");

    const updated = classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          students: [...cls.students, { name, phone }]
        };
      }
      return cls;
    });

    setClasses(updated);
    setStudentForm({ name: "", phone: "", classId: "" });
  };

  return (
    <div className="admin-dashboard container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Create Class Section */}
      <div className="create-class card mb-4 p-4 shadow-sm">
        <h5>Create New Class</h5>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Class Name"
          value={newClass.className}
          onChange={e => setNewClass({ ...newClass, className: e.target.value })}
        />
        <input
          type="file"
          className="form-control mb-3"
          accept=".pdf"
          onChange={e => setNewClass({ ...newClass, pdf: e.target.files[0] })}
        />
        <button className="btn btn-success" onClick={handleCreateClass}>Create Class</button>
      </div>

      {/* Add Student Section */}
      <div className="add-student card mb-4 p-4 shadow-sm">
        <h5>Add Student to Existing Class</h5>
        <select
          className="form-select mb-3"
          value={studentForm.classId}
          onChange={e => setStudentForm({ ...studentForm, classId: e.target.value })}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.className}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Student Name"
          value={studentForm.name}
          onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Phone Number"
          value={studentForm.phone}
          onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleAddStudent}>Add Student</button>
      </div>

      {/* Classes Overview */}
      <div className="classes-overview">
        <h4 className="mb-3">All Classes</h4>
        {classes.length === 0 ? (
          <p className="text-muted">No classes created yet.</p>
        ) : (
          classes.map(cls => (
            <div key={cls.id} className="card mb-3 shadow-sm p-3">
              <h5>{cls.className}</h5>
              <p><strong>PDF:</strong> {cls.pdfName}</p>
              <h6>Students:</h6>
              {cls.students.length === 0 ? (
                <p className="text-muted">No students enrolled.</p>
              ) : (
                <ul className="list-group">
                  {cls.students.map((stu, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between">
                      <span>{stu.name}</span>
                      <span>{stu.phone}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
