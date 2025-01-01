const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db.js"); // Adjust the path to your `db.js` file

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for the user with the given email
    const [rows] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);

    if (rows.length > 0) {
      const user = rows[0];

      // Compare the provided password with the hashed password
      if (bcrypt.compareSync(password, user.password_hash)) {
        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// posts sign up data to system
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const [existing_user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (existing_user.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the current timestamp for created_at
    const now = new Date();
    const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');

    // Insert the new user into the database
    const [result] = await db.execute(
      "INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
      ['finlay', email, hashedPassword, createdAt]
    );

    // Respond with success
    res.status(201).json({ message: "User created successfully", userId: result.insertId });

  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "An error occurred during sign up" });
  }
});

module.exports = router;