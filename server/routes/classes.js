const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js"); // Authentication middleware
const db = require("../db.js"); // Adjust the path to your `db.js` file
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/classes", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;
        const [classes] = await db.execute("SELECT * FROM classes WHERE user_id = ?", [id]);
        res.json(classes); // Return the fetched classes directly
    } catch (error) {
        console.error("Error collecting classes:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during class collection" });
    }
});

router.post("/createClass", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the authenticated user
        const { name, description } = req.body;
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

        // Insert the new class into the database
        const [result] = await db.execute(
            "INSERT INTO classes (user_id, name, description, created_at) VALUES (?, ?, ?, ?)",
            [userId, name, description, timestamp]
        );

        // Fetch the newly inserted class using the generated insertId
        const [newClass] = await db.execute(
            "SELECT * FROM classes WHERE id = ?",
            [result.insertId]
        );

        // Respond with the newly created class
        res.status(201).json(newClass[0]); // Return the first (and only) row
    } catch (error) {
        console.error("Error creating class:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during class creation" });
    }
});


module.exports = router;