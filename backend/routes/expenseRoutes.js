const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { 
  validateExpense, 
  validateExpenseQuery 
} = require('../middleware/validationMiddleware');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(validateExpenseQuery, getExpenses)
  .post(validateExpense, createExpense);

router.route('/:id')
  .get(getExpense)
  .put(validateExpense, updateExpense)
  .delete(deleteExpense);

router.get('/stats/overview', getExpenseStats);

module.exports = router;