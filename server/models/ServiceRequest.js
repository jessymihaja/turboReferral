const mongoose = require('mongoose');
const { SERVICE_REQUEST_STATUS } = require('../config/constants');
const { t } = require('../utils/i18n');

const serviceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, t('validation.nameRequired')],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  status: {
    type: String,
    enum: Object.values(SERVICE_REQUEST_STATUS),
    default: SERVICE_REQUEST_STATUS.PENDING,
  },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);