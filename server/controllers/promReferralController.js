const PromReferral = require('../models/PromReferral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.createPromReferral = asyncHandler(async (req, res) => {
  const { referralId, dateDebut, dateFin } = req.body;

  if (!referralId || !dateDebut || !dateFin) {
    throw new AppError('Missing required fields', 400);
  }

  const promReferral = new PromReferral({
    referral: referralId,
    dateDebut,
    dateFin,
  });

  await promReferral.save();
  ResponseHandler.created(res, promReferral, 'Promotion created successfully');
});

exports.getActivePromReferrals = asyncHandler(async (req, res) => {
  const today = new Date();

  const activePromotions = await PromReferral.find({
    dateDebut: { $lte: today },
    dateFin: { $gte: today },
  }).populate('referral');

  ResponseHandler.success(res, activePromotions);
});

exports.getActivePromReferralsByServiceId = asyncHandler(async (req, res) => {
  const today = new Date();

  const activePromotions = await PromReferral.find({
    dateDebut: { $lte: today },
    dateFin: { $gte: today },
  }).populate({
    path: 'referral',
    populate: {
      path: 'user',
      select: 'username',
    },
  });

  const filteredPromotions = activePromotions.filter(
    promo => promo.referral.service.toString() === req.params.id
  );

  ResponseHandler.success(res, filteredPromotions);
});
