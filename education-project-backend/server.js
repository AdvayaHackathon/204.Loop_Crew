require("dotenv").config({ path: ".env.local" });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { RuralDatabase } = require("./db.js");

const app = express();
const port = process.env.PORT || 5000;
const db = new RuralDatabase(process.env.NEON_LINK);
db.connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for PDF upload
const upload = multer({ storage: multer.memoryStorage() });

// ⚠️ Static Admin for now — should come from login later
const STATIC_ADMIN_ID = 1;

// ------------------------------------------
// ✅ Admin Signup
app.post("/api/admin/signup", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  try {
    const result = await db.InsertIntoAdmin(name, password);
    res.status(201).json({
      message: "Admin created successfully",
      adminId: result.rows[0].admin_id,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ Admin Signin
app.post("/api/admin/signin", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  try {
    const query = `SELECT * FROM Admin WHERE Admin_username = $1`;
    const result = await db.pool.query(query, [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];

    if (admin.admin_password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Sign-in successful", adminId: admin.admin_id });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ------------------------------------------
// ✅ Get all classes with student list
app.get("/api/classes", async (req, res) => {
  try {
    const classList = await db.Classes(STATIC_ADMIN_ID);

    const classesWithStudents = await Promise.all(
      classList.map(async (cls) => {
        const students = await db.Student(cls.class_id);
        return {
          _id: cls.class_id,
          name: cls.class_username,
          pdfName: cls.class_pdf_name,
          students: students.map((s) => ({
            name: s.student_name,
            phone: s.student_phnum,
          })),
        };
      })
    );

    res.json(classesWithStudents);
  } catch (err) {
    console.error("Fetch Classes Error:", err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

// ✅ Create new class with PDF
app.post("/api/classes", upload.single("pdf"), async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name || !file) {
    return res.status(400).json({ message: "Class name and PDF required" });
  }

  try {
    await db.InsertIntoClass(STATIC_ADMIN_ID, name, file.originalname, file.buffer);
    res.status(201).json({ message: "Class created successfully" });
  } catch (err) {
    console.error("Create Class Error:", err);
    res.status(500).json({ message: "Failed to create class" });
  }
});

// ✅ Add student to class
app.post("/api/classes/:classId/students", async (req, res) => {
  const { classId } = req.params;
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Student name and phone required" });
  }

  try {
    await db.InsertIntoStudents(classId, name, phone);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Add Student Error:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

// ------------------------------------------


app.get("/api/classes", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT Class_id, Class_username FROM Class");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching class list:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

app.get("/api/classes/list", async (req, res) => {
    try {
      const result = await db.pool.query("SELECT class_id, class_username FROM class");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching class list:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });


  // ✅ Get list of all classes (id + name only) - used for dropdown/list
app.get("/api/classes/list", async (req, res) => {
    try {
      const result = await db.pool.query("SELECT class_id, class_username FROM class");
      const classes = result.rows.map(row => ({
        _id: row.class_id,
        name: row.class_username,
      }));
      res.status(200).json(classes);
    } catch (err) {
      console.error("Error fetching class list:", err);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  

  
// ✅ Get students for a specific class
app.get("/api/classes/:classId/students", async (req, res) => {
    const { classId } = req.params;
  
    try {
      const result = await db.pool.query(
        "SELECT student_name, student_phnum FROM student WHERE class_id = $1",
        [classId]
      );
  
      const students = result.rows.map(row => ({
        name: row.student_name,
        phone: row.student_phnum,
      }));
  
      res.status(200).json(students);
    } catch (err) {
      console.error("Error fetching students for class:", err);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });
    

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
