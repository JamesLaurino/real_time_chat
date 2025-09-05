require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  let connection;
  try {
    connection = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS 
${DB_NAME}
`);
    await connection.changeUser({ database: DB_NAME });

    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    const queries = schema.split(';').filter(query => query.trim() !== '');

    for (const query of queries) {
      await connection.query(query);
    }

    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Error during database migration:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
