require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const { convertPdfToTts } = require('./pdftotts');

class RuralDatabase {
  constructor(link) {
    this.pool = new Pool({ connectionString: link });
  }

  async connectDb() {
    try {
      await this.pool.connect();
      console.log('✅ Connected to Neon :)');
    } catch (err) {
      console.error('❌ Database connection error:', err);
    }
  }

  async InsertIntoAdmin(Adminusername, AdminPasscode) {
    try {
      const queries = `INSERT INTO Admin(Admin_username, Admin_password)
                       VALUES($1, $2)
                       RETURNING Admin_id`;
      const result = await this.pool.query(queries, [Adminusername, AdminPasscode]);
      console.log('✅ Admin inserted with ID:', result.rows[0].admin_id);
      return result;
    } catch (err) {
      console.error('❌ InsertIntoAdmin Error:', err);
    }
  }

  async InsertIntoClass(Admin_Id, classname, filepath) {
    try {
      // 1. Save the file temporarily to convert
      
      const fileBuffer = fs.readFileSync(filepath);
      const fileName = filepath.split('/').pop(); 
      const tempDir = './temp';
      
      // ✅ Ensure folder exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      const tempPath = `${tempDir}/${Date.now()}_${fileName}`;
      fs.writeFileSync(tempPath, fileBuffer);
      
  
      // 2. Convert to audio URL
      const audioUrl = await convertPdfToTts(tempPath);
  
      // 3. Clean up temp file
      fs.unlinkSync(tempPath);
  
      // 4. Insert into DB with audio URL
      const queries = `INSERT INTO Class(Admin_id, Class_username, Class_pdf_name, Class_pdf, Class_audio_url)
                       VALUES($1, $2, $3, $4, $5)
                       RETURNING Class_id`;
      const result = await this.pool.query(queries, [Admin_Id, classname, fileName, fileBuffer, audioUrl]);
      console.log('✅ Class inserted with ID:', result.rows[0].class_id);
      return result;
    } catch (err) {
      console.error('❌ InsertIntoClass Error:', err);
      throw err;
    }
  }
  

    async InsertIntoStudents(classid, studentName, studentPhnum) {
    try {
      const queries = `INSERT INTO Student(class_id, student_name, student_phnum)
                       VALUES($1, $2, $3)
                       RETURNING student_id`;
      const result = await this.pool.query(queries, [classid, studentName, studentPhnum]);
      console.log('✅ Student inserted with ID:', result.rows[0].student_id);
    } catch (err) {
      console.error('❌ InsertIntoStudents Error:', err);
    }
  }

  async Classes(Admin_Id) {
    try {
      const queries = `SELECT Class_id, Class_username, Class_pdf_name FROM Class WHERE Admin_id=$1`;
      const result = await this.pool.query(queries, [Admin_Id]);
      console.log('📘 Classes:', result.rows);
      return result.rows;
    } catch (err) {
      console.error('❌ Classes Fetch Error:', err);
    }
  }

  async Student(Class_Id) {
    try {
      const queries = `SELECT Student_id, Student_name, Student_phnum FROM Student WHERE Class_id=$1`;
      const result = await this.pool.query(queries, [Class_Id]);
      console.log('👨‍🎓 Students:', result.rows);
      return result.rows;
    } catch (err) {
      console.error('❌ Student Fetch Error:', err);
    }
  }
  async InsertOrUpdateProgress(studentId, classId, lastPlayedSeconds = 0) {
    try {
      const query = `
        INSERT INTO progress(student_id, class_id, last_played_seconds)
        VALUES($1, $2, $3)
        ON CONFLICT (student_id, class_id)
        DO UPDATE SET last_played_seconds = EXCLUDED.last_played_seconds, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      const result = await this.pool.query(query, [studentId, classId, lastPlayedSeconds]);
      console.log('🔄 Progress inserted/updated:', result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error('❌ InsertOrUpdateProgress Error:', err);
    }
  }

  async GetProgress(studentId, classId) {
    try {
      const query = `
        SELECT last_played_seconds FROM progress
        WHERE student_id = $1 AND class_id = $2
        LIMIT 1;
      `;
      const result = await this.pool.query(query, [studentId, classId]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ GetProgress Error:', err);
    }
  }
  
  async getStudentByPhone(phone) {
    try {
      const query = `
        SELECT student_id, class_id, student_name
        FROM student
        WHERE student_phnum = $1
        LIMIT 1;
      `;
      const result = await this.pool.query(query, [phone]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ getStudentByPhone Error:', err);
    }
  }

  async getClassById(classId) {
    try {
      const query = `
        SELECT class_id, class_username, class_pdf_name, class_audio_url
        FROM class
        WHERE class_id = $1
        LIMIT 1;
      `;
      const result = await this.pool.query(query, [classId]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('❌ getClassById Error:', err);
    }
  }

  async DeleteProgress(studentId, classId) {
    try {
      const query = `DELETE FROM progress WHERE student_id = $1 AND class_id = $2;`;
      await this.pool.query(query, [studentId, classId]);
      console.log('🗑 Progress deleted for student:', studentId);
    } catch (err) {
      console.error('❌ DeleteProgress Error:', err);
    }
  }

  async ResetProgress(studentId, classId) {
    try {
      const query = `
        UPDATE progress
        SET last_played_seconds = 0, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = $1 AND class_id = $2;
      `;
      await this.pool.query(query, [studentId, classId]);
      console.log('🔁 Progress reset to 0 for student:', studentId);
    } catch (err) {
      console.error('❌ ResetProgress Error:', err);
    }
  }
  async end() {
    await this.pool.end();
    console.log('🔚 Database connection closed');
  }
}

// (async () => {
//   const db = new RuralDatabase(process.env.NEON_LINK);
//   await db.connectDb();

//   // Uncomment these as needed for testing:
//   // await db.InsertIntoAdmin("MAHAN", "welcome123");
//   await db.InsertIntoClass(1, "Class 6", 'C:/Users/Dell/Downloads/Karnataka.pdf');
//   // await db.InsertIntoStudents(1, "Raj", 6363647815);
// //   await db.Classes(1);
// //   await db.Student(1);

//   await db.end();
// })();
module.exports = { RuralDatabase };