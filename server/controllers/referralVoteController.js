const ReferralVote = require('../models/ReferralVote');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { VOTE_TYPES } = require('../config/constants');

exports.submitVote = asyncHandler(async (req, res) => {
  const { referralId } = req.params;
  const { vote, comment } = req.body;

  if (!Object.values(VOTE_TYPES).includes(vote)) {
    throw new AppError('Invalid vote', 400);
  }

  const existing = await ReferralVote.findOne({
    referral: referralId,
    user: req.user._id,
  });

  if (existing) {
    throw new AppError('You have already voted for this referral', 400);
  }

  const newVote = new ReferralVote({
    referral: referralId,
    user: req.user._id,
    vote,
    comment,
  });

  await newVote.save();
  ResponseHandler.created(res, null, 'Vote submitted successfully');
});

exports.getCommentsByReferral = asyncHandler(async (req, res) => {
  const comments = await ReferralVote.find({
    referral: req.params.referralId,
    comment: { $ne: '' },
  })
    .populate('user', 'username')
    .sort({ createdAt: -1 });

  ResponseHandler.success(res, comments);
});

exports.getAllAverageRatings = asyncHandler(async (req, res) => {
  const result = await ReferralVote.aggregate([
    {
      $group: {
        _id: '$referral',
        average: {
          $avg: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.GOOD] }, 1, 0],
          },
        },
        totalVotes: { $sum: 1 },
      },
    },
  ]);

  const averagesMap = {};
  result.forEach(r => {
    averagesMap[r._id.toString()] = {
      average: r.average,
      totalVotes: r.totalVotes,
    };
  });

  ResponseHandler.success(res, averagesMap);
});

exports.getAverageRatingByReferral = asyncHandler(async (req, res) => {
  const result = await ReferralVote.aggregate([
    { $match: { referral: new mongoose.Types.ObjectId(req.params.referralId) } },
    {
      $group: {
        _id: '$referral',
        average: {
          $avg: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.GOOD] }, 1, 0],
          },
        },
        totalVotes: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return ResponseHandler.success(res, { average: 0, totalVotes: 0 });
  }

  ResponseHandler.success(res, {
    average: result[0].average,
    totalVotes: result[0].totalVotes,
  });
});
