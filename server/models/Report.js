const mongoose = require('mongoose');
const { REPORT_REASONS, REPORT_STATUS } = require('../config/constants');
const { t } = require('../utils/i18n');

const reportSchema = new mongoose.Schema({
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, t('validation.referralRequired')],
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  reason: {
    type: String,
    enum: Object.values(REPORT_REASONS),
    required: [true, t('validation.reasonRequired')],
  },
  status: {
    type: Number,
    default: REPORT_STATUS.PENDING,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
