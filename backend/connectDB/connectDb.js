
// db.js
const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const port = process.env.DB_PORT;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

try {
    const connection = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log('Connected as id ' + connection.threadId);
    });

    module.exports = connection;
} catch (error) {
    console.error('Error Mysql connection', error);
}


