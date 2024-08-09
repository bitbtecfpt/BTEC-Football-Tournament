
// db.js
const mysql = require('mysql');
require('dotenv').config();
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const port = process.env.DB_PORT;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

const connection = mysql.createConnection({
    host:host,
    port: port,
    user: user,
    password: password,
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;
