const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware')

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const settingsRoutes = require('./settingsRoutes');

// Mount feature routers
router.use('/auth', authRoutes);
router.use('/dashboard', authenticateToken, dashboardRoutes);
router.use('/settings', authenticateToken, settingsRoutes);

module.exports = router;
