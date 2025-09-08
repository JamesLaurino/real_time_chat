const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../../.env.${env}`);

const result = dotenv.config({ path: envPath });

if (result.error && env === 'development') {
  console.warn(`Warning: .env.${env} file not found. Using global environment variables.`);
}


let sequelize;

if (process.env.NODE_ENV === 'test') {
  // Utiliser SQLite en mémoire pour les tests
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Désactiver les logs pour les tests
    dialect: 'sqlite'
  });
} else {
  // Utiliser MySQL pour le développement/production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false, // Mettre à console.log pour voir les requêtes SQL
    }
  );
}

module.exports = sequelize;
