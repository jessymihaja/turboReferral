const Referral = require('../models/Referral');
const Service = require('../models/Service');
const Notification = require('../models/Notification');
const ReferralVote = require('../models/ReferralVote');
const Report = require('../models/Report');
const PromReferral = require('../models/PromReferral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');

exports.getAllReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('service user');
  ResponseHandler.success(res, referrals);
});

exports.createReferral = asyncHandler(async (req, res) => {
  const { service, link, code, description } = req.body;
  const user = req.user._id;

  if ((!link && !code) || (link && code)) {
    throw new AppError(t('referral.linkOrCodeNotBoth'), 400);
  }

  const foundService = await Service.findById(service);
  if (!foundService) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  if (link && foundService.validationPatterns?.length > 0) {
    const isValid = foundService.validationPatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(link);
    });

    if (!isValid) {
      throw new AppError(t('validation.linkInvalid'), 400);
    }
  }

  const referral = new Referral({ service, user, link, code, description });
  await referral.save();
  await referral.populate('service');

  ResponseHandler.created(res, referral, t('referral.referralCreated'));
});

exports.deleteReferral = asyncHandler(async (req, res) => {
  const referral = await Referral.findById(req.params.id);
  if (!referral) {
    throw new AppError(t('referral.referralNotFound'), 404);
  }

  // Check if user owns this referral or is an admin
  const isOwner = referral.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    throw new AppError(t('referral.cannotDeleteOthersReferral'), 403);
  }

  await Notification.deleteMany({ referral: referral._id });
  await ReferralVote.deleteMany({ referral: referral._id });
  await Report.deleteMany({ referralId: referral._id });
  await Referral.deleteOne({ _id: referral._id });

  ResponseHandler.success(res, null, t('referral.referralDeleted'));
});

exports.getReferralsByServiceId = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [referrals, total] = await Promise.all([
    Referral.find({ service: req.params.id })
      .populate('service user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Referral.countDocuments({ service: req.params.id })
  ]);

  ResponseHandler.success(res, {
    referrals,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  });
});

exports.getReferralsByUserId = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [referrals, total] = await Promise.all([
    Referral.find({ user: req.params.id })
      .populate('user service')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Referral.countDocuments({ user: req.params.id })
  ]);

  ResponseHandler.success(res, {
    referrals,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  });
});

exports.getReferralsWithPromoStatus = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('user service');

  // Get ALL promotions (not just active ones) to show all promoted referrals
  const promos = await PromReferral.find();

  const promoMap = new Map(
    promos.map(p => [p.referral.toString(), true])
  );

  // Get vote counts for each referral
  const voteCounts = await ReferralVote.aggregate([
    {
      $group: {
        _id: '$referral',
        goodVotes: {
          $sum: { $cond: [{ $eq: ['$vote', 'good'] }, 1, 0] }
        },
        badVotes: {
          $sum: { $cond: [{ $eq: ['$vote', 'bad'] }, 1, 0] }
        }
      }
    }
  ]);

  const voteMap = new Map(
    voteCounts.map(v => [v._id.toString(), { goodVotes: v.goodVotes, badVotes: v.badVotes }])
  );

  const referralsWithStatus = referrals.map(ref => ({
    ...ref.toObject(),
    isPromoted: promoMap.has(ref._id.toString()),
    goodVotes: voteMap.get(ref._id.toString())?.goodVotes || 0,
    badVotes: voteMap.get(ref._id.toString())?.badVotes || 0,
  }));

  ResponseHandler.success(res, referralsWithStatus);
});
