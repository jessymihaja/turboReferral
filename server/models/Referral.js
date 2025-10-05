const mongoose = require('mongoose');
const { VALIDATION } = require('../config/constants');
const { t } = require('../utils/i18n');

const referralSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, t('validation.serviceRequired')],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, t('validation.userRequired')],
  },
  link: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return VALIDATION.URL_REGEX.test(v);
      },
      message: t('validation.linkInvalid'),
    },
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [VALIDATION.MAX_DESCRIPTION_LENGTH, t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH })],
    trim: true,
  },
}, { timestamps: true });

referralSchema.pre('validate', function(next) {
  if (!this.link && !this.code) {
    next(new Error(t('validation.linkOrCodeRequired')));
  } else if (this.link && this.code) {
    next(new Error(t('referral.linkOrCodeNotBoth')));
  } else {
    next();
  }
});

module.exports = mongoose.model('Referral', referralSchema);
