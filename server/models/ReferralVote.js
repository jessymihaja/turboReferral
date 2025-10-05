const mongoose = require('mongoose');
const { VOTE_TYPES, VALIDATION } = require('../config/constants');
const { t } = require('../utils/i18n');

const referralVoteSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, t('validation.referralRequired')],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  vote: {
    type: String,
    enum: Object.values(VOTE_TYPES),
    required: [true, t('validation.voteTypeRequired')],
  },
  comment: {
    type: String,
    maxlength: [VALIDATION.MAX_COMMENT_LENGTH, t('validation.commentMaxLength', { max: VALIDATION.MAX_COMMENT_LENGTH })],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

referralVoteSchema.index({ referral: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ReferralVote', referralVoteSchema);
