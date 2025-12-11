const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settlement = sequelize.define('Settlement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'group_id'
  },
  payerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'payer_id'
  },
  payeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'payee_id'
  },
  amount: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'settlements',
  schema: 'expense_tracker',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Settlement;
