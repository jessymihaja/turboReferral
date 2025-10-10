const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');

exports.getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isValidated: true }).populate('category');
  ResponseHandler.success(res, services);
});

exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('category');
  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }
  ResponseHandler.success(res, service);
});

exports.createService = asyncHandler(async (req, res) => {
  const { name, description, website, category } = req.body;

  let logo = '';
  if (req.file) {
    logo = `/uploads/logos/${req.file.filename}`;
  }

  const existing = await Service.findOne({ name });
  if (existing) {
    throw new AppError(t('service.serviceAlreadyExists'), 400);
  }

  const service = new Service({
    name,
    description,
    logo,
    website,
    isValidated: false,
    category,
    requestedBy: req.user?._id || req.user?.id,
  });

  await service.save();
  ResponseHandler.created(res, service, t('service.serviceCreated'));
});

exports.getUserServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ requestedBy: req.user._id })
    .populate('category')
    .sort({ createdAt: -1 });
  ResponseHandler.success(res, services);
});

exports.setServiceValidation = asyncHandler(async (req, res) => {
  const { isValidated, validationReason } = req.body;

  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  service.isValidated = isValidated;
  if (validationReason) {
    service.validationReason = validationReason;
  }
  await service.save();

  if (service.requestedBy) {
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: service.requestedBy,
      title: isValidated ?
        `Service "${service.name}" approuvé` :
        `Service "${service.name}" rejeté`,
      content: isValidated ?
        `Votre demande de service "${service.name}" a été approuvée et est maintenant disponible.` :
        `Votre demande de service "${service.name}" a été rejetée${validationReason ? `: ${validationReason}` : '.'}`,
      link: `/services/${service._id}`,
    });
  }

  ResponseHandler.success(
    res,
    service,
    t('service.serviceValidated')
  );
});

exports.updateService = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.logo = `/uploads/logos/${req.file.filename}`;
  }

  const service = await Service.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  ResponseHandler.success(res, service, t('service.serviceUpdated'));
});
