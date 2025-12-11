const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroup,
  addMember,
  removeMember,
  createGroupExpense,
  settleExpense,
  getGroupBalances,
  settleGroup,
  deleteGroup
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const { 
  validateGroup 
} = require('../middleware/validationMiddleware');

router.use(protect);

router.route('/')
  .get(getGroups)
  .post(validateGroup, createGroup);

router.route('/:id')
  .get(getGroup)
  .delete(deleteGroup);

router.route('/:id/members')
  .post(addMember);

router.route('/:id/members/:userId')
  .delete(removeMember);

router.route('/:id/expenses')
  .post(createGroupExpense);

router.route('/:id/balances')
  .get(getGroupBalances);

router.route('/:id/settle')
  .post(settleGroup);

// Expense settlement route
router.post('/expenses/:id/settle', settleExpense);

module.exports = router;