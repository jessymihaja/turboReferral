const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logo: String,
  website: String,
  validationPatterns: [{ type: String }], // tableau de regex sous forme de string
  isValidated: { type: Boolean, default: false }, // champ validation admin
  category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
