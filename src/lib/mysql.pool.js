const mysql = require('mysql2/promise');

const {
  dbHost,
  dbName,
  dbPort,
  dbPassword,
  dbUser,
} = require('../config');

const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  database: dbName,
  password: dbPassword,
});

module.exports = pool;
