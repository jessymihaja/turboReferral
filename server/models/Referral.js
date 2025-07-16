const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // identifiant user (ex: username ou email)
  link: {
    type: String,
    unique: true,
    sparse: true,
    // Validation simple optionnelle, vérifie que si link est présent, c’est une URL basique
    validate: {
      validator: function(v) {
        if (!v) return true; // lien vide ok (car code peut être présent)
        return /^https?:\/\/.+$/.test(v.trim());
      },
      message: props => `${props.value} n'est pas un lien valide`
    }
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
  },
  description: { type: String, maxlength: 100 },
}, { timestamps: true });

// Validation personnalisée : soit link soit code (mais pas les deux)
referralSchema.pre('validate', function(next) {
  if (!this.link && !this.code) {
    next(new Error('Un referral doit avoir soit un lien, soit un code.'));
  } else if (this.link && this.code) {
    next(new Error('Un referral ne peut pas avoir à la fois un lien et un code.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Referral', referralSchema);
