const mongoose = require('mongoose');
const { t } = require('../utils/i18n');

const categorySchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
