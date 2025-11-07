const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');

// Main route to get all network information
router.get('/getDashboardHealth', dashboardService.getDashboardRoutesHealth);

// Get only user details
router.post('/getDashboardInformation', dashboardService.getDashInfo);

// Implement Your Own Endpoints Here

module.exports = router;