const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'receipt'
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#3B82F6'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default'
  }
}, {
  tableName: 'categories',
  schema: 'expense_tracker',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Seed default categories
Category.seedDefaults = async () => {
  const categories = [
    { name: 'Food & Dining', description: 'Restaurants, groceries, snacks', icon: 'utensils', color: '#FF6B6B', isDefault: true },
    { name: 'Transportation', description: 'Fuel, public transport, taxis', icon: 'car', color: '#4ECDC4', isDefault: true },
    { name: 'Shopping', description: 'Clothing, electronics, gifts', icon: 'shopping-bag', color: '#FFD166', isDefault: true },
    { name: 'Entertainment', description: 'Movies, concerts, hobbies', icon: 'film', color: '#06D6A0', isDefault: true },
    { name: 'Bills & Utilities', description: 'Electricity, water, internet', icon: 'file-invoice', color: '#118AB2', isDefault: true },
    { name: 'Healthcare', description: 'Medicine, doctor visits', icon: 'heart', color: '#EF476F', isDefault: true },
    { name: 'Education', description: 'Courses, books, software', icon: 'graduation-cap', color: '#7209B7', isDefault: true },
    { name: 'Travel', description: 'Flights, hotels, vacations', icon: 'plane', color: '#3A86FF', isDefault: true }
  ];

  for (const category of categories) {
    await Category.findOrCreate({
      where: { name: category.name },
      defaults: category
    });
  }
};

module.exports = Category;