const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isValidated: true }).populate('category');
  ResponseHandler.success(res, services);
});

exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('category');
  if (!service) {
    throw new AppError('Service not found', 404);
  }
  ResponseHandler.success(res, service);
});

exports.createService = asyncHandler(async (req, res) => {
  const { name, description, website, validationPatterns, category } = req.body;

  let logo = '';
  if (req.file) {
    logo = `/uploads/logos/${req.file.filename}`;
  }

  const existing = await Service.findOne({ name });
  if (existing) {
    throw new AppError('Service already exists', 400);
  }

  const service = new Service({
    name,
    description,
    logo,
    website,
    validationPatterns,
    isValidated: false,
    category,
  });

  await service.save();
  ResponseHandler.created(res, service, 'Service created successfully');
});

exports.setServiceValidation = asyncHandler(async (req, res) => {
  const { isValidated } = req.body;

  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError('Service not found', 404);
  }

  service.isValidated = isValidated;
  await service.save();

  ResponseHandler.success(
    res,
    service,
    `Service ${isValidated ? 'validated' : 'invalidated'} successfully`
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
    throw new AppError('Service not found', 404);
  }

  ResponseHandler.success(res, service, 'Service updated successfully');
});
