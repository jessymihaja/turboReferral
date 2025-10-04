const mongoose = require('mongoose');
const { VALIDATION } = require('../config/constants');

const referralSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
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
      message: 'Invalid link format',
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
    maxlength: [VALIDATION.MAX_DESCRIPTION_LENGTH, `Description cannot exceed ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`],
    trim: true,
  },
}, { timestamps: true });

referralSchema.pre('validate', function(next) {
  if (!this.link && !this.code) {
    next(new Error('Referral must have either a link or a code'));
  } else if (this.link && this.code) {
    next(new Error('Referral cannot have both a link and a code'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Referral', referralSchema);
