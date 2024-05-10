const { Pool } = require('pg')

const pool = new Pool ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'employees_db'
});

module.exports = pool;