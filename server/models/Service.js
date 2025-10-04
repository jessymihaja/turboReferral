const mongoose = require('mongoose');
const { VALIDATION } = require('../config/constants');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
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
    match: [VALIDATION.URL_REGEX, 'Invalid website URL'],
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
    required: [true, 'Category is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
