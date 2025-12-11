const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const ExpenseSplit = require('../models/ExpenseSplit');
const GroupMember = require('../models/GroupMember');
const Group = require('../models/Group');

// @desc    Get spending analytics
// @route   GET /api/analytics/spending
// @access  Private
const getSpendingAnalytics = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        expenseDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
    } else {
      // Default to current month
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFilter = {
        expenseDate: {
          [Op.gte]: startOfMonth
        }
      };
    }
    
    // Get total spending by category
    const categorySpending = await Expense.findAll({
      where: {
        userId: req.user.id,
        ...dateFilter
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      attributes: [
        'categoryId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('Expense.id')), 'count']
      ],
      group: ['categoryId', 'category.id', 'category.name', 'category.color'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });
    
    // Get daily spending trend
    const dailyTrend = await Expense.findAll({
      where: {
        userId: req.user.id,
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('expense_date')), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('Expense.id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('expense_date'))],
      order: [[sequelize.fn('DATE', sequelize.col('expense_date')), 'ASC']]
    });
    
    // Get monthly comparison
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const currentMonthTotal = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        expenseDate: {
          [Op.gte]: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        }
      }
    });
    
    const lastMonthTotal = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        expenseDate: {
          [Op.between]: [
            new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
          ]
        }
      }
    });
    
    // Calculate percentage change
    const monthlyChange = lastMonthTotal ? 
      ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;
    
    res.json({
      success: true,
      data: {
        categorySpending: categorySpending.map(item => ({
          categoryId: item.categoryId,
          categoryName: item.category?.name || 'Uncategorized',
          color: item.category?.color || '#6B7280',
          total: parseFloat(item.dataValues.total) || 0,
          count: parseInt(item.dataValues.count) || 0,
          percentage: 0 // Will calculate on frontend
        })),
        dailyTrend: dailyTrend.map(item => ({
          date: item.dataValues.date,
          total: parseFloat(item.dataValues.total) || 0,
          count: parseInt(item.dataValues.count) || 0
        })),
        summary: {
          totalSpent: categorySpending.reduce((sum, item) => 
            sum + parseFloat(item.dataValues.total), 0),
          totalTransactions: categorySpending.reduce((sum, item) => 
            sum + parseInt(item.dataValues.count), 0),
          averagePerTransaction: categorySpending.reduce((sum, item) => 
            sum + parseFloat(item.dataValues.total), 0) / 
            (categorySpending.reduce((sum, item) => 
              sum + parseInt(item.dataValues.count), 0) || 1),
          monthlyComparison: {
            currentMonth: currentMonthTotal || 0,
            lastMonth: lastMonthTotal || 0,
            changePercentage: monthlyChange
          }
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get category analytics
// @route   GET /api/analytics/categories
// @access  Private
const getCategoryAnalytics = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Expense,
        as: 'expenses',
        where: { userId: req.user.id },
        required: false,
        attributes: []
      }],
      attributes: [
        'id', 'name', 'color', 'icon',
        [sequelize.fn('COUNT', sequelize.col('expenses.id')), 'expenseCount'],
        [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalAmount']
      ],
      group: ['Category.id'],
      order: [[sequelize.fn('SUM', sequelize.col('expenses.amount')), 'DESC']]
    });
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        expenseCount: parseInt(cat.dataValues.expenseCount) || 0,
        totalAmount: parseFloat(cat.dataValues.totalAmount) || 0
      }))
    });
  } catch (error) {
    console.error('Category analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// exports moved to end of file after all handlers

// @desc    Get user's overall balance (what others owe them minus what they owe)
// @route   GET /api/user/balance
// @access  Private
const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total others owe to this user: sum of expense_splits where the expense was paid by user and split belongs to others
    const owedToRows = await sequelize.query(
      `SELECT COALESCE(SUM(es.amount),0) AS total
       FROM expense_tracker.expense_splits es
       JOIN expense_tracker.expenses e ON es.expense_id = e.id
       WHERE e.user_id = :userId
         AND es.user_id != :userId
         AND es.is_paid = false`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );

    // Total this user owes to others: sum of expense_splits where split.user_id = user and expense paid by someone else
    const owedByRows = await sequelize.query(
      `SELECT COALESCE(SUM(es.amount),0) AS total
       FROM expense_tracker.expense_splits es
       JOIN expense_tracker.expenses e ON es.expense_id = e.id
       WHERE es.user_id = :userId
         AND e.user_id != :userId
         AND es.is_paid = false`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );

    const owedTo = parseFloat(owedToRows[0].total) || 0;
    const owedBy = parseFloat(owedByRows[0].total) || 0;
    const net = owedTo - owedBy;

    res.json({ success: true, data: { owedTo, owedBy, net } });
  } catch (error) {
    console.error('Get user balance error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user's expenses count
// @route   GET /api/user/expenses/count
// @access  Private
const getUserExpensesCount = async (req, res) => {
  try {
    const count = await Expense.count({ where: { userId: req.user.id } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get expenses count error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user's groups count
// @route   GET /api/user/groups/count
// @access  Private
const getUserGroupsCount = async (req, res) => {
  try {
    const count = await GroupMember.count({ where: { userId: req.user.id } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get groups count error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Export handlers
module.exports = {
  getSpendingAnalytics,
  getCategoryAnalytics,
  getUserBalance,
  getUserExpensesCount,
  getUserGroupsCount
};