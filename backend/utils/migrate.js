const sequelize = require('../config/database');
require('dotenv').config();

const migrateDatabase = async () => {
  try {
    // Create schema if not exists
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS expense_tracker');
    
    // Enable UUID extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    console.log('Database schema created successfully!');
    console.log('Now run: npm start');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

migrateDatabase();