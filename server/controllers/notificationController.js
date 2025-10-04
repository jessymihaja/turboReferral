const Notification = require('../models/Notification');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  ResponseHandler.success(res, notifications);
});

exports.markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  ResponseHandler.success(res, null, 'Notification marked as read');
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
  });
  ResponseHandler.success(res, { count });
});

exports.warnUser = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.reportId).populate('referralId');

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  const referral = report.referralId;
  if (!referral) {
    throw new AppError('Referral not found', 404);
  }

  const userId = referral.user._id;
  const lien = referral.link || referral.code || 'lien inconnu';
  const raison = report.reason || 'Aucune raison spécifiée';

  const title = `Avertissement sur le lien "${lien}" pour contenu "${raison}"`;
  const content = `Veuillez modifier votre lien "${lien}" afin de respecter les termes et conditions de notre site.`;

  const newNotif = await Notification.create({ userId, title, content });

  ResponseHandler.created(res, newNotif, 'Warning notification sent');
});

exports.warnUserDeletedReferral = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.reportId).populate('referralId');

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  const referral = report.referralId;
  if (!referral) {
    throw new AppError('Referral not found', 404);
  }

  const userId = referral.user._id;
  const lien = referral.link || referral.code || 'lien inconnu';
  const raison = report.reason || 'Aucune raison spécifiée';

  const title = `Avertissement : Votre lien "${lien}" a été supprimé`;
  const content = `Votre lien "${lien}" a été supprimé en raison de son contenu "${raison}". Veuillez respecter les termes et conditions de notre site pour éviter de futurs problèmes.`;

  const newNotif = await Notification.create({ userId, title, content });

  ResponseHandler.created(res, newNotif, 'Deletion warning notification sent');
});
