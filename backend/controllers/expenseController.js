const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const ExpenseSplit = require('../models/ExpenseSplit');
const User = require('../models/User');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { 
      categoryId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    const where = { userId: req.user.id };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate[Op.gte] = new Date(startDate);
      if (endDate) where.expenseDate[Op.lte] = new Date(endDate);
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get expenses with pagination
    const { count, rows: expenses } = await Expense.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: ExpenseSplit,
          as: 'splits',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          }]
        }
      ],
      order: [['expenseDate', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
    
    // Get total amount
    const totalAmountResult = await Expense.sum('amount', { where });
    
    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        },
        summary: {
          totalAmount: totalAmountResult || 0,
          totalCount: count
        }
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: ExpenseSplit,
          as: 'splits',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          }]
        }
      ]
    });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }
    
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { 
      title, 
      amount, 
      description, 
      categoryId, 
      expenseDate, 
      paymentMethod,
      isShared,
      splits 
    } = req.body;
    
    // Create expense
    const expense = await Expense.create({
      title,
      amount: parseFloat(amount),
      description,
      categoryId: categoryId || null,
      expenseDate: expenseDate || new Date(),
      paymentMethod,
      isShared: isShared || false,
      userId: req.user.id
    });
    
    // If shared expense, create splits
    if (isShared && splits && splits.length > 0) {
      const splitPromises = splits.map(split => 
        ExpenseSplit.create({
          expenseId: expense.id,
          userId: split.userId,
          amount: split.amount,
          sharePercentage: split.sharePercentage,
          isPaid: split.isPaid || false
        })
      );
      
      await Promise.all(splitPromises);
    }
    
    // Get expense with relations
    const createdExpense = await Expense.findByPk(expense.id, {
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: ExpenseSplit,
          as: 'splits'
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: createdExpense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }
    
    // Update expense
    await expense.update(req.body);
    
    // Get updated expense with relations
    const updatedExpense = await Expense.findByPk(expense.id, {
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: ExpenseSplit,
          as: 'splits'
        }
      ]
    });
    
    res.json({
      success: true,
      data: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }
    
    await expense.destroy();
    
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats/overview
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get weekly total
    const weeklyTotal = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        expenseDate: {
          [Op.gte]: startOfWeek
        }
      }
    });
    
    // Get monthly total
    const monthlyTotal = await Expense.sum('amount', {
      where: {
        userId: req.user.id,
        expenseDate: {
          [Op.gte]: startOfMonth
        }
      }
    });
    
    // Get category breakdown
    const categoryBreakdown = await Expense.findAll({
      where: {
        userId: req.user.id,
        expenseDate: {
          [Op.gte]: startOfMonth
        }
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      attributes: [
        'categoryId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('Expense.id')), 'count']
      ],
      group: ['categoryId', 'category.id', 'category.name', 'category.color'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        weeklyTotal: weeklyTotal || 0,
        monthlyTotal: monthlyTotal || 0,
        categoryBreakdown: categoryBreakdown.map(item => ({
          categoryId: item.categoryId,
          categoryName: item.category?.name || 'Uncategorized',
          color: item.category?.color || '#6B7280',
          totalAmount: parseFloat(item.dataValues.totalAmount),
          count: parseInt(item.dataValues.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};