const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js"); // Authentication middleware
const db = require("../db.js"); // Adjust the path to your `db.js` file
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/classes", authenticateToken, async (req, res) => {
    try {
        console.log("hello");
        const [classes] = await db.execute("SELECT * FROM classes");
        res.json(classes); // Return the fetched classes directly
    } catch (error) {
        console.error("Error collecting classes:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during class collection" });
    }
});

module.exports = router;