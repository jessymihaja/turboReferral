const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, notificationController.getUserNotifications);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.post('/warn/:reportId', notificationController.warnUser);
router.get('/unread-count',authMiddleware, notificationController.getUnreadCount);

module.exports = router;
