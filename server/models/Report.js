const mongoose = require('mongoose');
const { REPORT_REASONS, REPORT_STATUS } = require('../config/constants');

const reportSchema = new mongoose.Schema({
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, 'Referral is required'],
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required'],
  },
  reason: {
    type: String,
    enum: Object.values(REPORT_REASONS),
    required: [true, 'Reason is required'],
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
