const mongoose = require('mongoose');
const { VALIDATION } = require('../config/constants');
const { t } = require('../utils/i18n');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, t('validation.nameRequired')],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
    trim: true,
    match: [VALIDATION.URL_REGEX, t('validation.linkInvalid')],
  },
  validationPatterns: [{
    type: String,
  }],
  isValidated: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, t('validation.categoryRequired')],
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
