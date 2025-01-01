const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '578DA494f!',
    database: 'flashcards_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the promise-based pool
const db = pool.promise();

module.exports = db;