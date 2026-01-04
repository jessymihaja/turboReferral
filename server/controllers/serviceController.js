const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');
const { optimizeServiceLogo, deleteImageVariants } = require('../utils/imageOptimizer');

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
  let { name, description, website, category } = req.body;

  let logo = '';
  if (req.file) {
    const optimizedImages = await optimizeServiceLogo(req.file.path, req.file.filename);
    logo = optimizedImages.original;
  }

  // Parse JSON strings from form data if needed
  if (typeof name === 'string') {
    try {
      name = JSON.parse(name);
    } catch (e) {
      // If parsing fails, treat as legacy string format
    }
  }

  if (typeof description === 'string') {
    try {
      description = JSON.parse(description);
    } catch (e) {
      // If parsing fails, treat as legacy string format
    }
  }

  // Handle multilingual names
  let nameObj = {};
  if (typeof name === 'string') {
    // If name is a simple string, use it for French by default
    nameObj.fr = name;
  } else if (typeof name === 'object' && name !== null) {
    // If name is an object with language keys
    nameObj = name;
  }

  // Handle multilingual descriptions
  let descriptionObj = {};
  if (typeof description === 'string') {
    // If description is a simple string, use it for French by default
    descriptionObj.fr = description;
  } else if (typeof description === 'object' && description !== null) {
    // If description is an object with language keys
    descriptionObj = description;
  }

  // Check for existing service by name (check both string and multilingual formats)
  const existing = await Service.findOne({
    $or: [
      { name: name }, // Legacy string name
      { 'name.fr': typeof name === 'string' ? name : name?.fr },
      { 'name.en': typeof name === 'string' ? name : name?.en }
    ]
  });
  if (existing) {
    throw new AppError(t('service.serviceAlreadyExists'), 400);
  }

  const service = new Service({
    name: nameObj,
    description: descriptionObj,
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
    const serviceName = typeof service.name === 'string' ? service.name : (service.name?.fr || service.name?.en || '');
    await Notification.create({
      userId: service.requestedBy,
      title: isValidated ?
        t('service.serviceApprovedTitle', { name: serviceName }) :
        t('service.serviceRejectedTitle', { name: serviceName }),
      content: isValidated ?
        t('service.serviceApprovedContent', { name: serviceName }) :
        t('service.serviceRejectedContent', { name: serviceName, reason: validationReason ? `: ${validationReason}` : '.' }),
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

  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  if (req.file) {
    if (service.logo) {
      await deleteImageVariants(service.logo);
    }
    const optimizedImages = await optimizeServiceLogo(req.file.path, req.file.filename);
    updates.logo = optimizedImages.original;
  }

  if (updates.name && typeof updates.name === 'string') {
    try {
      updates.name = JSON.parse(updates.name);
    } catch (e) {
      // Not a JSON string, treat as a simple string
    }
  }

  if (updates.description && typeof updates.description === 'string') {
    try {
      updates.description = JSON.parse(updates.description);
    } catch (e) {
    }
  }

  // Handle multilingual names
  if (updates.name !== undefined) {
    if (typeof updates.name === 'string') {
      // If name is a simple string, update French version
      service.name = { ...service.name, fr: updates.name };
    } else if (typeof updates.name === 'object' && updates.name !== null) {
      // If name is an object with language keys, merge with existing
      service.name = { ...service.name, ...updates.name };
    }
    delete updates.name; // Remove from updates to avoid overwriting
  }

  // Handle multilingual descriptions
  if (updates.description !== undefined) {
    if (typeof updates.description === 'string') {
      // If description is a simple string, update French version
      service.description = { ...service.description, fr: updates.description };
    } else if (typeof updates.description === 'object' && updates.description !== null) {
      // If description is an object with language keys, merge with existing
      service.description = { ...service.description, ...updates.description };
    }
    delete updates.description; // Remove from updates to avoid overwriting
  }

  Object.assign(service, updates);
  await service.save();
  await service.populate('category');

  ResponseHandler.success(res, service, t('service.serviceUpdated'));
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new AppError(t('service.serviceNotFound'), 404);
  }

  // Delete associated logo files
  if (service.logo) {
    await deleteImageVariants(service.logo);
  }

  await Service.findByIdAndDelete(req.params.id);
  ResponseHandler.success(res, null, t('service.serviceDeleted'));
});
