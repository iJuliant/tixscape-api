require('dotenv').config()
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  err
    ? console.log(err)
    : console.log('Database connection success!')
})

module.exports = connection
