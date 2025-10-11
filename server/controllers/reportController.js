const Report = require('../models/Report');
const Referral = require('../models/Referral');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { REPORT_STATUS } = require('../config/constants');
const { t } = require('../utils/i18n');

exports.createReport = asyncHandler(async (req, res) => {
  const { referralId, reason } = req.body;
  const reporterId = req.user._id;

  const existingReport = await Report.findOne({ referralId, reporterId });
  if (existingReport) {
    throw new AppError(t('report.alreadyReported'), 400);
  }

  const newReport = new Report({ referralId, reporterId, reason });
  await newReport.save();

  ResponseHandler.created(res, null, t('report.reportCreated'));
});

exports.getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('referralId')
    .populate('reporterId', 'username');

  ResponseHandler.success(res, reports);
});

exports.getPendingReports = asyncHandler(async (req, res) => {
  const reports = await Report.aggregate([
    { $match: { status: REPORT_STATUS.PENDING } },
    { $sort: { reportedAt: 1 } },
    {
      $group: {
        _id: '$referralId',
        report: { $first: '$$ROOT' },
      },
    },
    {
      $replaceRoot: { newRoot: '$report' },
    },
  ]);

  const populatedReports = await Report.populate(reports, [
    {
      path: 'referralId',
      populate: {
        path: 'user',
        select: 'username isBlocked profilePhoto',
      },
    },
    {
      path: 'reporterId',
      select: 'username',
    },
  ]);

  ResponseHandler.success(res, populatedReports);
});

exports.ignoreReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    throw new AppError(t('report.reportNotFound'), 404);
  }

  const result = await Report.updateMany(
    { referralId: report.referralId },
    { $set: { status: REPORT_STATUS.RESOLVED } }
  );

  ResponseHandler.success(
    res,
    { modifiedCount: result.modifiedCount },
    t('report.reportUpdated')
  );
});

exports.deleteReferral = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate({
    path: 'referralId',
    populate: { path: 'user service' }
  });

  if (!report) {
    throw new AppError(t('report.reportNotFound'), 404);
  }

  const referral = report.referralId;
  if (!referral) {
    throw new AppError(t('referral.referralNotFound'), 404);
  }

  const userId = referral.user._id;
  const lien = referral.link || referral.code || 'lien inconnu';
  const serviceName = referral.service?.name || 'service inconnu';
  const raison = report.reason || 'Aucune raison spécifiée';

  const title = `Votre parrainage "${serviceName}" a été supprimé`;
  const content = `Votre lien "${lien}" a été supprimé pour la raison suivante : "${raison}". Veuillez respecter les conditions d'utilisation lors de vos prochaines publications.`;

  await Notification.create({ userId, title, content });

  await User.findByIdAndUpdate(userId, { $inc: { deletedReferralsCount: 1 } });

  await Referral.findByIdAndDelete(referral._id);

  const result = await Report.updateMany(
    { referralId: report.referralId },
    { $set: { status: REPORT_STATUS.RESOLVED } }
  );

  ResponseHandler.success(
    res,
    { modifiedCount: result.modifiedCount },
    t('report.referralDeletedAndNotificationSent')
  );
});
