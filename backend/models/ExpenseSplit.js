const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpenseSplit = sequelize.define('ExpenseSplit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  expenseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'expense_id',
    references: { model: 'expenses', key: 'id' }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  sharePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'share_percentage',
    validate: {
      min: 0,
      max: 100
    }
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_paid'
  },
  paidAt: {
    type: DataTypes.DATE,
    field: 'paid_at'
  }
}, {
  tableName: 'expense_splits',
  schema: 'expense_tracker',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ExpenseSplit;