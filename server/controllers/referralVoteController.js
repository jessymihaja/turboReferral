const ReferralVote = require('../models/ReferralVote');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { VOTE_TYPES } = require('../config/constants');
const { t } = require('../utils/i18n');

exports.submitVote = asyncHandler(async (req, res) => {
  const { referralId } = req.params;
  const { vote, comment } = req.body;

  if (!Object.values(VOTE_TYPES).includes(vote)) {
    throw new AppError(t('validation.voteTypeInvalid'), 400);
  }

  const existing = await ReferralVote.findOne({
    referral: referralId,
    user: req.user._id,
  });

  if (existing) {
    throw new AppError(t('vote.alreadyVoted'), 400);
  }

  const newVote = new ReferralVote({
    referral: referralId,
    user: req.user._id,
    vote,
    comment,
  });

  await newVote.save();
  ResponseHandler.created(res, null, t('vote.voteRecorded'));
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
        upvotes: {
          $sum: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.GOOD] }, 1, 0],
          },
        },
        downvotes: {
          $sum: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.BAD] }, 1, 0],
          },
        },
        totalVotes: { $sum: 1 },
      },
    },
  ]);

  const averagesMap = {};
  result.forEach(r => {
    averagesMap[r._id.toString()] = {
      upvotes: r.upvotes,
      downvotes: r.downvotes,
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
        upvotes: {
          $sum: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.GOOD] }, 1, 0],
          },
        },
        downvotes: {
          $sum: {
            $cond: [{ $eq: ['$vote', VOTE_TYPES.BAD] }, 1, 0],
          },
        },
        totalVotes: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return ResponseHandler.success(res, { upvotes: 0, downvotes: 0, totalVotes: 0 });
  }

  ResponseHandler.success(res, {
    upvotes: result[0].upvotes,
    downvotes: result[0].downvotes,
    totalVotes: result[0].totalVotes,
  });
});

exports.getUserVoteForReferral = asyncHandler(async (req, res) => {
  const userVote = await ReferralVote.findOne({
    referral: req.params.referralId,
    user: req.user._id,
  });

  if (!userVote) {
    return ResponseHandler.success(res, null);
  }

  ResponseHandler.success(res, {
    vote: userVote.vote,
    comment: userVote.comment,
    createdAt: userVote.createdAt,
  });
});

exports.deleteVote = asyncHandler(async (req, res) => {
  const { referralId } = req.params;

  const deletedVote = await ReferralVote.findOneAndDelete({
    referral: referralId,
    user: req.user._id,
  });

  if (!deletedVote) {
    throw new AppError(t('vote.noVoteFound'), 404);
  }

  ResponseHandler.success(res, null, t('vote.voteDeleted'));
});
