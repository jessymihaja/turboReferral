const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logo: { type: String }, // chemin du fichier logo
  website: String,
  validationPatterns: [{ type: String }],
  isValidated: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Service', serviceSchema);
