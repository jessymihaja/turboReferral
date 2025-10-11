const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

exports.getUserNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Notification.countDocuments({ userId: req.user._id });
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  ResponseHandler.success(res, {
    notifications,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + notifications.length < total,
    },
  });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  ResponseHandler.success(res, null, t('notification.notificationMarkedRead'));
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
  });
  ResponseHandler.success(res, { count });
});
