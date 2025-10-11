const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/user/:userId', badgeController.getUserBadges);
router.post('/user/:userId/update', authenticateToken, badgeController.updateBadges);

module.exports = router;
