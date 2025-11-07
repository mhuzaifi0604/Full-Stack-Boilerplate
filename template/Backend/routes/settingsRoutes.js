const express = require('express');
const router = express.Router();
const settingsService = require('../services/settingsService');
const {authenticateToken} = require('../middleware/authMiddleware')

router.get('/getSettingsHealth', authenticateToken, settingsService.getSettingsRoutesHealth);
router.post('/saveProfileDetails',authenticateToken, settingsService.getSettingsInfo);

module.exports = router;
