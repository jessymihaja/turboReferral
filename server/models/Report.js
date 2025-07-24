const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: true
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['Brisé', 'Trompeur', 'Abusif', 'Autre'],
    required: true
  },
  status: {
    type: Number,
    default: 1, // 1 = à vérifier, 0 = traité
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
