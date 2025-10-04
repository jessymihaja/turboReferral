const mongoose = require('mongoose');
const { VOTE_TYPES, VALIDATION } = require('../config/constants');

const referralVoteSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, 'Referral is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  vote: {
    type: String,
    enum: Object.values(VOTE_TYPES),
    required: [true, 'Vote is required'],
  },
  comment: {
    type: String,
    maxlength: [VALIDATION.MAX_COMMENT_LENGTH, `Comment cannot exceed ${VALIDATION.MAX_COMMENT_LENGTH} characters`],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

referralVoteSchema.index({ referral: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ReferralVote', referralVoteSchema);
