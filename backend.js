import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';

dotenv.config();

const app = express();
const port = 5001;
app.use(express.json());
app.use(cors());

const caCertPath = path.resolve('./', process.env.DB_CA_PATH);

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    ca: fs.readFileSync(caCertPath)
  },
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, user_email, user_password FROM user_info');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/test', (req, res) => {
  res.send('Server reachable!');
});

// ============= FUNCTIONALITY FOR USER AUTHENTICATION ============= //
//Login Functionality
app.post('/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // Query user by email
    const [rows] = await pool.query(
      'SELECT * FROM user_info WHERE user_email = ?',
      [user_email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Login successful
    res.json({ message: 'Login successful', user: { id: user.id, email: user.user_email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// ============= FUNCTIONALITY FOR REGISTERING NEW PRODUCT ============= // 
app.post('/add-product', async (req, res) => {
    console.log("POST /add-product hit"); // <-- debug
    console.log("Body:", req.body);

  try {
    const {
      product_name,
      product_brand,
      product_ingredients,
      diet_id,
      diet_name,
      is_compatible,
      compatibility_score,
      risk_level,
      reasons,
      warnings,
      recommendations,
      product_source,
    } = req.body;

    const sql = `
      INSERT INTO dietary_analysis
      (product_name, product_brand, product_ingredients, diet_id, diet_name, is_compatible, compatibility_score, risk_level, reasons, warnings, recommendations, product_source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      product_name,
      product_brand,
      product_ingredients,
      diet_id,
      diet_name,
      is_compatible,
      compatibility_score,
      risk_level,
      reasons,
      warnings,
      recommendations,
      product_source,
    ]);

    res.json({ message: 'Product added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ============= FUNCTIONALITY FOR DISPLAYING HISTORY ============= // 
app.get("/history", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        product_name,
        product_brand,
        product_ingredients,
        diet_id,
        diet_name,
        is_compatible,
        compatibility_score,
        risk_level,
        reasons,
        warnings,
        recommendations,
        product_source
       FROM dietary_analysis
       ORDER BY id DESC
       LIMIT 15`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dietary history" });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on Port ${port}`);
});
