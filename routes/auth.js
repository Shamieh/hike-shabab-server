import express from "express";
import db from "../db.js";


const authRoutes = express.Router();


//localhost:3001/api/auth/signup
authRoutes.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (exists.rows.length > 0)
    return res.status(400).json({ message: "User already exists" });

  const result = await db.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, role]
  );

  res.status(201).json({ user: result.rows[0] })
  .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Signup failed" });
    });
});


//localhost:3001/api/auth/login
authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ user: result.rows[0] });
});

export default authRoutes;