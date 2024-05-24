const { Pool } = require('pg')

const db = new Pool ({
    user: 'postgres',
    password: '3131',
    host: 'localhost',
    database: 'employees_db',
});


module.exports = db;