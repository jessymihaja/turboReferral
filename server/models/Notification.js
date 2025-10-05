const mongoose = require('mongoose');
const { t } = require('../utils/i18n');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  title: {
    type: String,
    required: [true, t('validation.titleRequired')],
    trim: true,
  },
  content: {
    type: String,
    required: [true, t('validation.contentRequired')],
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
