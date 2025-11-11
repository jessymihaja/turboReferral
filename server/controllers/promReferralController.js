const PromReferral = require('../models/PromReferral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');

exports.createPromReferral = asyncHandler(async (req, res) => {
  const { referralId, dateDebut, dateFin } = req.body;

  if (!referralId || !dateDebut || !dateFin) {
    throw new AppError(t('errors.badRequest'), 400);
  }

  const promReferral = new PromReferral({
    referral: referralId,
    dateDebut,
    dateFin,
  });

  await promReferral.save();
  ResponseHandler.created(res, promReferral, t('promReferral.promReferralCreated'));
});

exports.getActivePromReferrals = asyncHandler(async (req, res) => {
  const today = new Date();

  const activePromotions = await PromReferral.find({
    dateDebut: { $lte: today },
    dateFin: { $gte: today },
  }).populate({
    path: 'referral',
    match: { isActive: true }
  });

  // Filter out promotions where referral is null (due to isActive: false)
  const filteredPromotions = activePromotions.filter(promo => promo.referral);

  ResponseHandler.success(res, filteredPromotions);
});

exports.getActivePromReferralsByServiceId = asyncHandler(async (req, res) => {
  const today = new Date();

  const activePromotions = await PromReferral.find({
    dateDebut: { $lte: today },
    dateFin: { $gte: today },
  }).populate({
    path: 'referral',
    match: { isActive: true },
    populate: [
      {
        path: 'user',
        select: 'username',
      },
      {
        path: 'service',
        select: 'name',
      }
    ],
  });

  const filteredPromotions = activePromotions.filter(
    promo => promo.referral && promo.referral.service && promo.referral.service._id.toString() === req.params.id
  );

  ResponseHandler.success(res, filteredPromotions);
});

exports.getPromReferralByReferralId = asyncHandler(async (req, res) => {
  const promotion = await PromReferral.findOne({
    referral: req.params.id
  }).sort({ createdAt: -1 });

  if (!promotion) {
    throw new AppError(t('promReferral.notFound'), 404);
  }

  ResponseHandler.success(res, promotion);
});
