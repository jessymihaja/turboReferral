const mongoose = require('mongoose');

const referralVoteSchema = new mongoose.Schema({
  referral: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: String, enum: ['good', 'bad'], required: true },
  comment: { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
});

// Empêcher plusieurs votes d'un même utilisateur sur le même referral
referralVoteSchema.index({ referral: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ReferralVote', referralVoteSchema);
