const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../config/constants');
const { t } = require('../utils/i18n');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, t('validation.usernameRequired')],
    unique: true,
    trim: true,
    minlength: [3, t('validation.usernameMinLength', { min: 3 })],
    maxlength: [30, t('validation.usernameMaxLength', { max: 30 })],
    match: [/^[a-zA-Z0-9_]+$/, t('validation.usernameInvalid')],
  },
  email: {
    type: String,
    required: [true, t('validation.emailRequired')],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, t('validation.emailInvalid')],
  },
  password: {
    type: String,
    required: [true, t('validation.passwordRequired')],
    minlength: [6, t('validation.passwordMinLength', { min: 6 })],
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
  },
  deletedReferralsCount: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
