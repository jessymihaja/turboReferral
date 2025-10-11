const mongoose = require('mongoose');
const { t } = require('../utils/i18n');

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  type: {
    type: String,
    enum: ['referral_10', 'referral_50', 'referral_100', 'trusted', 'risky'],
    required: [true, t('validation.badgeTypeRequired')],
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

badgeSchema.index({ user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);
