require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'test') {
  // Use in-memory SQLite for tests
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Disable logging for tests
    dialect: 'sqlite'
  });
} else {
  // Use MySQL for development/production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false, // Set to console.log to see SQL queries
    }
  );
}

module.exports = sequelize;
