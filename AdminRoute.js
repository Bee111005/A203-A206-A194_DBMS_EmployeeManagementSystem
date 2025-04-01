import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.delete("/category/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM category WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Message: "Category deleted successfully" });
    });
});


// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
router.post("/update_admin", upload.single("image"), (req, res) => {
    const { email, name, category_id, address, salary } = req.body;
    let imagePath = req.file ? req.file.filename : null;

    console.log("Update Request Received:", { email, name, category_id, address, salary, imagePath });

    // ✅ Step 1: Ensure an entry exists in admin_details
    const insertIfNotExistsSQL = "INSERT IGNORE INTO admin_details (email) VALUES (?)";
    con.query(insertIfNotExistsSQL, [email], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({ Status: false, Error: "Database query error" });
        }

        // ✅ Step 2: Construct Update Query
        let updateQuery = `
            UPDATE admin_details 
            SET name = ?, category_id = ?, address = ?, salary = ? 
            ${imagePath ? ", image = ?" : ""} 
            WHERE email = ?;
            `.replace(", WHERE", " WHERE"); // Prevents syntax error if image is not updated

        let params = imagePath 
            ? [name, category_id, address, salary, imagePath, email] 
            : [name, category_id, address, salary, email];

        con.query(updateQuery, params, (err, result) => {
            if (err) {
                console.error("Update Error:", err);
                return res.json({ Status: false, Error: "Query Error" });
            }

            console.log("Update Successful:", result);
            return res.json({ Status: true, Message: "Admin updated successfully" });
        });
    });
});

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
router.delete('/admins/:id', (req, res) => {
    const adminId = req.params.id;
  
    // Query to delete the admin with the specified ID
    const sql = 'DELETE FROM admin WHERE id = ?';
    
    con.query(sql, [adminId], (err, result) => {
      if (err) {
        console.error('Error deleting admin:', err);
        return res.status(500).send({ error: 'Error deleting admin' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Admin not found' });
      }
  
      res.status(200).send({ message: 'Admin deleted successfully' });
    });
  });
  
  

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = `
        SELECT a.email, 
               COALESCE(ad.name, 'N/A') AS name, 
               COALESCE(ad.address, 'N/A') AS address, 
               COALESCE(ad.salary, 'N/A') AS salary, 
               COALESCE(ad.image, NULL) AS image, 
               COALESCE(c.name, 'N/A') AS category
        FROM admin a
        LEFT JOIN admin_details ad ON a.email = ad.email
        LEFT JOIN category c ON ad.category_id = c.id
    `;

    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

// Get employees with attendance data
router.get('/employee_with_attendance', (req, res) => {
    const sql = `
      SELECT e.id AS employee_id, e.name AS employee_name, a.date AS attendance_date, a.status AS attendance_status
      FROM employee e
      LEFT JOIN attendance a ON e.id = a.employee_id
      ORDER BY e.name, a.date DESC;
    `;
  
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error executing SQL:", err); // Log the error
        return res.json({ Status: false, Error: "Query Error: " + err });
      }
  
      if (result.length === 0) {
        return res.json({ Status: false, Message: "No employees found." });
      }
  
      return res.json({ Status: true, Result: result });
    });
  });
  
  router.post('/mark_attendance', (req, res) => {
    const { employeeId, date, status } = req.body;
  
    // Insert attendance record for an employee
    const sql = "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)";
  
    con.query(sql, [employeeId, date, status], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Message: "Attendance marked successfully" });
    });
  });
// Fetch employees data
router.get('/employees', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json(result);  // Ensure it returns employee data
    });
  });
  
// Fetch attendance data
router.get('/attendance', (req, res) => {
    const sql = "SELECT * FROM attendance";
    con.query(sql, (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json(result);  // Ensure it returns attendance data
    });
  });
// Add attendance
router.post('/attendance', (req, res) => {
    const { employeeId, date, status } = req.body;
  
    const sql = "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)";
    con.query(sql, [employeeId, date, status], (err, result) => {
      if (err) {
        console.error("Error adding attendance:", err);
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json({ Status: true, Message: "Attendance added" });
    });
  });
    

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";  // Query to fetch employee data
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });  // Send the result back to frontend
    });
});



export { router as adminRouter };