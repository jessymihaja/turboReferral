const ServiceRequest = require('../models/ServiceRequest');
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { SERVICE_REQUEST_STATUS } = require('../config/constants');

exports.createServiceRequest = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const nameTrimmed = name.trim();

  const existingRequest = await ServiceRequest.findOne({
    name: nameTrimmed,
    status: SERVICE_REQUEST_STATUS.PENDING,
  });

  if (existingRequest) {
    throw new AppError('A request with this service name is already pending', 400);
  }

  const existingService = await Service.findOne({ name: nameTrimmed });
  if (existingService) {
    throw new AppError('This service already exists', 400);
  }

  const serviceRequest = new ServiceRequest({
    name: nameTrimmed,
    description: description?.trim() || '',
    user: req.user._id,
    status: SERVICE_REQUEST_STATUS.PENDING,
  });

  await serviceRequest.save();

  ResponseHandler.created(res, serviceRequest, 'Service request created successfully');
});
