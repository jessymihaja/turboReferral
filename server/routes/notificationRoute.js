const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');

const {
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  warnUser,
  warnUserDeletedReferral,
} = require('../controllers/notificationController');

router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.put('/:id/read', authenticateToken, idValidator, markAsRead);
router.post('/warn/:reportId', adminAuthMiddleware, idValidator, warnUser);
router.post(
  '/warnDeletedReferral/:reportId',
  adminAuthMiddleware,
  idValidator,
  warnUserDeletedReferral
);

module.exports = router;
