const { body, validationResult, param, query } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').notEmpty().withMessage('Username is required'),
  body('fullName').optional().isString(),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Expense validations
const validateExpense = [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('expenseDate').optional().isISO8601().withMessage('Invalid date format'),
  body('categoryId').optional().isUUID().withMessage('Invalid category ID'),
  body('description').optional().isString(),
  handleValidationErrors
];

// Friend validations
const validateFriendRequest = [
  body('friendId').isUUID().withMessage('Invalid friend ID'),
  handleValidationErrors
];

// Group validations
const validateGroup = [
  body('name').notEmpty().withMessage('Group name is required'),
  body('description').optional().isString(),
  handleValidationErrors
];

// Query validations
const validateExpenseQuery = [
  query('categoryId').optional().isUUID(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateExpense,
  validateFriendRequest,
  validateGroup,
  validateExpenseQuery
};