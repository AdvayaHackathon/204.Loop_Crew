require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

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

  async InsertIntoClass(Admin_Id, classname, fileName, fileBuffer) {
    try {
      const queries = `INSERT INTO Class(Admin_id, Class_username, Class_pdf_name, Class_pdf)
                       VALUES($1, $2, $3, $4)
                       RETURNING Class_id`;
      const result = await this.pool.query(queries, [Admin_Id, classname, fileName, fileBuffer]);
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

  async end() {
    await this.pool.end();
    console.log('🔚 Database connection closed');
  }
}

// 🔄 Example usage
// (async () => {
//   const db = new RuralDatabase(process.env.NEON_LINK);
//   await db.connectDb();

//   // Uncomment these as needed for testing:
//   // await db.InsertIntoAdmin("MAHAN", "welcome123");
//   // await db.InsertIntoClass(1, "Class 9", 'C:/Users/Admin/Downloads/dummy.pdf');
//   // await db.InsertIntoStudents(1, "Raj", 6363647815);
//   await db.Classes(1);
//   await db.Student(1);

//   await db.end();
// })();
module.exports = { RuralDatabase };