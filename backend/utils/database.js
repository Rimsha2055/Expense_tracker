const sequelize = require('../config/database');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const Friendship = require('../models/Friendship');
const FriendInvite = require('../models/FriendInvite');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const ExpenseSplit = require('../models/ExpenseSplit');
const Settlement = require('../models/Settlement');

// User associations
User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
User.hasMany(Friendship, { foreignKey: 'userId', as: 'sentFriendRequests' });
User.hasMany(Friendship, { foreignKey: 'friendId', as: 'receivedFriendRequests' });
User.hasMany(Group, { foreignKey: 'createdBy', as: 'createdGroups' });
User.hasMany(GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });
User.hasMany(ExpenseSplit, { foreignKey: 'userId', as: 'expenseSplits' });

// Expense associations
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Expense.hasMany(ExpenseSplit, { foreignKey: 'expenseId', as: 'splits' });
Expense.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// Category associations
Category.hasMany(Expense, { foreignKey: 'categoryId', as: 'expenses' });

// Friendship associations
Friendship.belongsTo(User, { foreignKey: 'userId', as: 'requester' });
Friendship.belongsTo(User, { foreignKey: 'friendId', as: 'receiver' });
// FriendInvite associations
FriendInvite.belongsTo(User, { foreignKey: 'inviterId', as: 'inviter' });

// Group associations
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Group.hasMany(GroupMember, { foreignKey: 'groupId', as: 'members' });
Group.hasMany(Expense, { foreignKey: 'groupId', as: 'expenses' });

// GroupMember associations
GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ExpenseSplit associations
ExpenseSplit.belongsTo(Expense, { foreignKey: 'expenseId', as: 'expense' });
ExpenseSplit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Settlement associations
Settlement.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
Settlement.belongsTo(User, { foreignKey: 'payerId', as: 'payer' });
Settlement.belongsTo(User, { foreignKey: 'payeeId', as: 'payee' });
Group.hasMany(Settlement, { foreignKey: 'groupId', as: 'settlements' });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
    
    // Seed default categories
    const Category = require('../models/Category');
    await Category.seedDefaults();
    console.log('Default categories seeded.');
    
    return sequelize;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, syncDatabase };