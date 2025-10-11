const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { idValidator } = require('../utils/validators');

const {
  getUserNotifications,
  markAsRead,
  getUnreadCount,
} = require('../controllers/notificationController');

router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.put('/:id/read', authenticateToken, idValidator, markAsRead);

module.exports = router;
