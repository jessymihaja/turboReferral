const Service = require('../models/Service');
const Referral = require('../models/Referral');
const User = require('../models/User');
const PromReferral = require('../models/PromReferral');
const ReferralVote = require('../models/ReferralVote');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { VOTE_TYPES } = require('../config/constants');
const { t } = require('../utils/i18n');

exports.listServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate('category');
  ResponseHandler.success(res, services);
});

exports.validateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  service.isValidated = true;
  await service.save();

  ResponseHandler.success(res, service, t('service.serviceValidated'));
});

exports.listReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('service user');
  ResponseHandler.success(res, referrals);
});

exports.updateReferral = asyncHandler(async (req, res) => {
  const { link, code, description, promo } = req.body;

  const referral = await Referral.findById(req.params.id);
  if (!referral) {
    throw new AppError(t('referral.referralNotFound'), 404);
  }

  if (link !== undefined) referral.link = link;
  if (code !== undefined) referral.code = code;
  if (description !== undefined) referral.description = description;
  if (promo !== undefined) referral.promo = promo;

  await referral.save();
  await referral.populate('service');

  ResponseHandler.success(res, referral, t('referral.referralUpdated'));
});

exports.getStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    pendingServices,
    validatedServices,
    totalReferrals,
    totalUsers,
    activePromotions,
    recentUsers,
    recentServices
  ] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ isValidated: false }),
    Service.countDocuments({ isValidated: true }),
    Referral.countDocuments(),
    User.countDocuments(),
    PromReferral.countDocuments({ 
      dateDebut: { $lte: new Date() }, 
      dateFin: { $gte: new Date() } 
    }),
    User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    }),
    Service.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    })
  ]);

  const stats = {
    services: {
      total: totalServices,
      pending: pendingServices,
      validated: validatedServices,
      recent: recentServices
    },
    referrals: {
      total: totalReferrals
    },
    users: {
      total: totalUsers,
      recent: recentUsers
    },
    promotions: {
      active: activePromotions
    }
  };

  ResponseHandler.success(res, stats);
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  // Get referrals growth over last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const referralsGrowth = await Referral.aggregate([
    {
      $match: { createdAt: { $gte: thirtyDaysAgo } }
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get services growth over last 30 days
  const servicesGrowth = await Service.aggregate([
    {
      $match: { createdAt: { $gte: thirtyDaysAgo } }
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get users growth over last 30 days
  const usersGrowth = await User.aggregate([
    {
      $match: { createdAt: { $gte: thirtyDaysAgo } }
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get top services by referrals count
  const topServices = await Referral.aggregate([
    {
      $group: {
        _id: "$service",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'serviceData'
      }
    },
    { $unwind: '$serviceData' },
    {
      $project: {
        name: '$serviceData.name',
        count: 1
      }
    }
  ]);

  // Get top contributors
  const topContributors = await Referral.aggregate([
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userData'
      }
    },
    { $unwind: '$userData' },
    {
      $project: {
        username: '$userData.username',
        count: 1
      }
    }
  ]);

  // Get referrals by type (link vs code)
  const referralsByType = await Referral.aggregate([
    {
      $group: {
        _id: {
          $cond: [
            { $ifNull: ["$link", false] },
            "link",
            "code"
          ]
        },
        count: { $sum: 1 }
      }
    }
  ]);

  const analytics = {
    growth: {
      referrals: referralsGrowth,
      services: servicesGrowth,
      users: usersGrowth
    },
    topServices,
    topContributors,
    referralsByType
  };

  ResponseHandler.success(res, analytics);
});

exports.listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', role = '', isBlocked = '' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) query.role = role;
  if (isBlocked !== '') query.isBlocked = isBlocked === 'true';

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  ResponseHandler.success(res, {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

exports.getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  const userReferrals = await Referral.find({ user: userId }).populate('service').sort({ createdAt: -1 });
  const referralIds = userReferrals.map(r => r._id);

  const [
    totalReferrals,
    votesGiven,
    votesReceived,
    reports
  ] = await Promise.all([
    Referral.countDocuments({ user: userId }),
    ReferralVote.find({ user: userId }).populate('referral'),
    ReferralVote.find({
      referral: { $in: referralIds }
    }),
    Report.find({ referralId: { $in: referralIds } })
      .populate({
        path: 'referralId',
        populate: [
          { path: 'service', select: 'name' },
          { path: 'user', select: 'username profilePhoto' }
        ]
      })
      .populate('reporterId', 'username')
  ]);

  const positiveVotes = votesReceived.filter(v => v.vote === VOTE_TYPES.GOOD).length;
  const negativeVotes = votesReceived.filter(v => v.vote === VOTE_TYPES.BAD).length;
  const totalVotesReceived = votesReceived.length;
  const avgVote = totalVotesReceived > 0
    ? (positiveVotes / totalVotesReceived) * 100
    : 0;

  const positiveVotesGiven = votesGiven.filter(v => v.vote === VOTE_TYPES.GOOD).length;
  const negativeVotesGiven = votesGiven.filter(v => v.vote === VOTE_TYPES.BAD).length;

  const userDetails = {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      isBlocked: user.isBlocked,
      deletedReferralsCount: user.deletedReferralsCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    stats: {
      referrals: {
        total: totalReferrals,
        list: userReferrals
      },
      votesReceived: {
        total: totalVotesReceived,
        positive: positiveVotes,
        negative: negativeVotes,
        average: avgVote.toFixed(2)
      },
      votesGiven: {
        total: votesGiven.length,
        positive: positiveVotesGiven,
        negative: negativeVotesGiven
      },
      reports: {
        total: reports.length,
        list: reports
      }
    }
  };

  ResponseHandler.success(res, userDetails);
});

exports.blockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { isBlocked } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  user.isBlocked = isBlocked;
  if (isBlocked) {
    await Referral.updateMany({ user: userId }, { $set: { isActive: false } });
    await Report.deleteMany({ reporterId: userId });
  } else {
    await Referral.updateMany({ user: userId }, { $set: { isActive: true } });
  }

  await user.save();

  const message = isBlocked
    ? t('user.userBlocked')
    : t('user.userUnblocked');

  ResponseHandler.success(res, user, message);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  await Promise.all([
    Referral.deleteMany({ user: userId }),
    ReferralVote.deleteMany({ user: userId }),
    Report.deleteMany({ reporterId: userId }),
    User.findByIdAndDelete(userId)
  ]);

  ResponseHandler.success(res, null, t('user.userDeleted'));
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    throw new AppError('Rôle invalide. Doit être "user" ou "admin"', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  // Prevent changing own role
  if (userId === req.user.id) {
    throw new AppError('Vous ne pouvez pas modifier votre propre rôle', 403);
  }

  user.role = role;
  await user.save();

  const message = role === 'admin'
    ? 'Utilisateur promu administrateur avec succès'
    : 'Utilisateur rétrogradé en utilisateur standard';

  ResponseHandler.success(res, { _id: user._id, username: user.username, email: user.email, role: user.role }, message);
});
