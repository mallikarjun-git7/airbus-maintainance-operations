const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  logout
} = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

module.exports = router;
