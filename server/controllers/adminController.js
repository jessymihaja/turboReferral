const Service = require('../models/Service');
const Referral = require('../models/Referral');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.listServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate('category');
  ResponseHandler.success(res, services);
});

exports.validateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError('Service not found', 404);
  }

  service.isValidated = true;
  await service.save();

  ResponseHandler.success(res, service, 'Service validated successfully');
});

exports.listReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find().populate('service user');
  ResponseHandler.success(res, referrals);
});

exports.updateReferral = asyncHandler(async (req, res) => {
  const { link, code, description, promo } = req.body;

  const referral = await Referral.findById(req.params.id);
  if (!referral) {
    throw new AppError('Referral not found', 404);
  }

  if (link !== undefined) referral.link = link;
  if (code !== undefined) referral.code = code;
  if (description !== undefined) referral.description = description;
  if (promo !== undefined) referral.promo = promo;

  await referral.save();
  await referral.populate('service');

  ResponseHandler.success(res, referral, 'Referral updated successfully');
});
