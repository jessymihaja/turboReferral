const mongoose = require('mongoose');
const { VALIDATION } = require('../config/constants');
const { t } = require('../utils/i18n');

function extractDomain(url) {
  if (!url) return '';
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}

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
  websiteDomain: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  validationReason: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, t('validation.categoryRequired')],
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

serviceSchema.pre('save', function(next) {
  if (this.website) {
    this.websiteDomain = extractDomain(this.website);
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
