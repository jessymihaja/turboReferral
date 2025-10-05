const Service = require('../models/Service');
const Referral = require('../models/Referral');
const User = require('../models/User');
const PromReferral = require('../models/PromReferral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
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
