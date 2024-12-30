const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1', // Replace with your database host
    user: 'root', // Replace with your database username
    password: '578DA494f!', // Replace with your database password
    database: 'flashcards_app', // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise-based pool
const db = pool.promise();

module.exports = db;