import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  console.log('Testing connection with:')
  console.log('Host:', process.env.DB_HOST || 'localhost')
  console.log('User:', process.env.DB_USER || 'root')
  console.log('Password:', process.env.DB_PASSWORD || 'root')

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'
    })
    console.log('SUCCESS: Connected to MySQL server!')
    
    await connection.execute('CREATE DATABASE IF NOT EXISTS forum')
    console.log('SUCCESS: Database "forum" checked/created.')
    
    await connection.end()
  } catch (err) {
    console.error('FAILED to connect to MySQL:')
    console.error(err)
  }
}

testConnection()
