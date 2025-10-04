const Referral = require('../models/Referral');
const Service = require('../models/Service');
const Notification = require('../models/Notification');
const ReferralVote = require('../models/ReferralVote');
const Report = require('../models/Report');
const PromReferral = require('../models/PromReferral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.getAllReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('service user');
  ResponseHandler.success(res, referrals);
});

exports.createReferral = asyncHandler(async (req, res) => {
  const { service, link, code, description } = req.body;
  const user = req.user._id;

  if ((!link && !code) || (link && code)) {
    throw new AppError('Provide either a link or a code, not both', 400);
  }

  const foundService = await Service.findById(service);
  if (!foundService) {
    throw new AppError('Service not found', 404);
  }

  if (link && foundService.validationPatterns?.length > 0) {
    const isValid = foundService.validationPatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(link);
    });

    if (!isValid) {
      throw new AppError(`Link does not match pattern for ${foundService.name}`, 400);
    }
  }

  const referral = new Referral({ service, user, link, code, description });
  await referral.save();
  await referral.populate('service');

  ResponseHandler.created(res, referral, 'Referral created successfully');
});

exports.deleteReferral = asyncHandler(async (req, res) => {
  const referral = await Referral.findById(req.params.id);
  if (!referral) {
    throw new AppError('Referral not found', 404);
  }

  await Notification.deleteMany({ referral: referral._id });
  await ReferralVote.deleteMany({ referral: referral._id });
  await Report.deleteMany({ referralId: referral._id });
  await Referral.deleteOne({ _id: referral._id });

  ResponseHandler.success(res, null, 'Referral and dependencies deleted');
});

exports.getReferralsByServiceId = asyncHandler(async (req, res) => {
  const referrals = await Referral.find({ service: req.params.id })
    .populate('service user');
  ResponseHandler.success(res, referrals);
});

exports.getReferralsByUserId = asyncHandler(async (req, res) => {
  const referrals = await Referral.find({ user: req.params.id })
    .populate('user service');
  ResponseHandler.success(res, referrals);
});

exports.getReferralsWithPromoStatus = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('user service');

  const now = new Date();
  const promos = await PromReferral.find({
    dateDebut: { $lte: now },
    dateFin: { $gte: now },
  });

  const activePromoMap = new Map(
    promos.map(p => [p.referral.toString(), true])
  );

  const referralsWithStatus = referrals.map(ref => ({
    ...ref.toObject(),
    isPromoted: activePromoMap.has(ref._id.toString()),
  }));

  ResponseHandler.success(res, referralsWithStatus);
});
