const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken } = require('../middleware/authMiddleware')

// Login
router.post('/login', authService.login);

// Get current user
router.get('/me', authenticateToken, authService.getCurrentUser);

// Logout
router.post('/logout', authenticateToken, authService.logout);

module.exports = router;
