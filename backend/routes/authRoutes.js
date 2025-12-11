const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  refreshToken,
  logoutUser 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { 
  validateRegister, 
  validateLogin 
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

module.exports = router;