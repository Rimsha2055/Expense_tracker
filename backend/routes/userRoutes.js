const express = require('express');
const router = express.Router();
const { getUserBalance, getUserExpensesCount, getUserGroupsCount } = require('../controllers/analyticsController');
const { getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);

router.get('/balance', getUserBalance);
router.get('/expenses/count', getUserExpensesCount);
router.get('/groups/count', getUserGroupsCount);

// Get all users (for Add Friend browsing)
router.get('/all', getAllUsers);

module.exports = router;
