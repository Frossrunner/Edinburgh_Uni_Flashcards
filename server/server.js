// Import required modules
const express = require('express');
const path = require('path');
const db = require('./db'); // Import the database connection

// Initialize the Express application
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Serve static files from the "dist" directory (where Vite builds your app)
app.use(express.static(path.join(__dirname, '../WEB_APP/dist')));

// Catch-all route to serve the React app for any request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../WEB_APP/dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
