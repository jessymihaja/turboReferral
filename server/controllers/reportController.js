const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { REPORT_STATUS } = require('../config/constants');

exports.createReport = asyncHandler(async (req, res) => {
  const { referralId, reason } = req.body;
  const reporterId = req.user._id;

  const existingReport = await Report.findOne({ referralId, reporterId });
  if (existingReport) {
    throw new AppError('You have already reported this referral', 400);
  }

  const newReport = new Report({ referralId, reporterId, reason });
  await newReport.save();

  ResponseHandler.created(res, null, 'Report submitted successfully');
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
        select: 'username',
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
    throw new AppError('Report not found', 404);
  }

  const result = await Report.updateMany(
    { referralId: report.referralId },
    { $set: { status: REPORT_STATUS.RESOLVED } }
  );

  ResponseHandler.success(
    res,
    { modifiedCount: result.modifiedCount },
    'All reports for this referral were marked as resolved'
  );
});
