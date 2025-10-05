const mongoose = require('mongoose');
const { t } = require('../utils/i18n');

const promReferralSchema = new mongoose.Schema({
  referral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: [true, t('validation.referralRequired')],
  },
  dateDebut: {
    type: Date,
    required: [true, t('validation.startDateRequired')],
  },
  dateFin: {
    type: Date,
    required: [true, t('validation.endDateRequired')],
  },
}, { timestamps: true });

promReferralSchema.pre('validate', function(next) {
  if (this.dateFin <= this.dateDebut) {
    next(new Error(t('validation.endDateInvalid')));
  } else {
    next();
  }
});

module.exports = mongoose.model('PromReferral', promReferralSchema);
