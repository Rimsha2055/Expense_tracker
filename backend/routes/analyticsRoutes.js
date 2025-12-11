const express = require('express');
const router = express.Router();
const {
  getSpendingAnalytics,
  getCategoryAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/spending', getSpendingAnalytics);
router.get('/categories', getCategoryAnalytics);

module.exports = router;