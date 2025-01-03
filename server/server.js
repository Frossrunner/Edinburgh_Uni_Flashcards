// Import required modules
const express = require('express');
const path = require('path');
const db = require('./db'); // Import the database connection
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateToken = require("./middleware/authenticatetoken.js");
require("dotenv").config();
const authRoutes = require("./routes/auth.js");
const classRoutes = require("./routes/classes.js");


// Initialize the Express application
const app = express();
app.use(express.json());


// Define a port
const PORT = process.env.PORT || 3000;

// Serve static files from the "dist" directory (where Vite builds app)
app.use(express.static(path.join(__dirname, '../WEB_APP/dist')));

// use Routes
app.use("/api", authRoutes);
app.use("/api", classRoutes);

// Catch-all route to serve the React app for any request
app.get('*',authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../WEB_APP/dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
