const mongoose = require('mongoose');

const promReferralSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, 'Referral is required'],
  },
  dateDebut: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  dateFin: {
    type: Date,
    required: [true, 'End date is required'],
  },
}, { timestamps: true });

promReferralSchema.pre('validate', function(next) {
  if (this.dateFin <= this.dateDebut) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('PromReferral', promReferralSchema);
