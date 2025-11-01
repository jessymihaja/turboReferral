const mongoose = require('mongoose');
const { VALIDATION, REFERRAL_TYPES, REFERRAL_LIMITS } = require('../config/constants');
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
    maxlength: [VALIDATION.MAX_CODE_LENGTH, t('validation.codeMaxLength', { max: VALIDATION.MAX_CODE_LENGTH })],
  },
  description: {
    type: mongoose.Schema.Types.Mixed, // Allows both String and Object
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        
        if (typeof value === 'string') {
          return value.length <= VALIDATION.MAX_DESCRIPTION_LENGTH;
        } else if (typeof value === 'object' && value !== null) {
          for (const lang in value) {
            if (typeof value[lang] === 'string' && value[lang].length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
              return false;
            }
          }
          return true;
        }
        return false;
      },
      message: t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH })
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: [REFERRAL_TYPES.PERMANENT, REFERRAL_TYPES.TEMPORARY],
    default: REFERRAL_TYPES.PERMANENT,
    required: [true, t('validation.typeRequired')],
  },
  dateDebut: {
    type: Date,
    default: Date.now,
  },
  dateFin: {
    type: Date,
    validate: {
      validator: function(v) {
        if (this.type === REFERRAL_TYPES.TEMPORARY && !v) {
          return false;
        }
        if (v && this.dateDebut && v <= this.dateDebut) {
          return false;
        }
        return true;
      },
      message: t('validation.dateFinRequired'),
    },
  },
}, { timestamps: true });

referralSchema.pre('validate', async function(next) {
  try {
    if (!this.link && !this.code) {
      return next(new Error(t('validation.linkOrCodeRequired')));
    }
    if (this.link && this.code) {
      return next(new Error(t('referral.linkOrCodeNotBoth')));
    }

    if (this.isActive) {
      const Referral = mongoose.model('Referral');
      const query = {
        service: this.service,
        user: this.user,
        isActive: true,
        _id: { $ne: this._id }
      };

      const existingActiveReferral = await Referral.findOne(query);
      if (existingActiveReferral) {
        return next(new Error(t('validation.oneActiveReferralPerService')));
      }
    }

    if (this.type === REFERRAL_TYPES.PERMANENT && this.isNew) {
      const daysInMs = REFERRAL_LIMITS.PERMANENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
      this.dateFin = new Date(this.dateDebut.getTime() + daysInMs);
    }

    next();
  } catch (error) {
    next(error);
  }
});

referralSchema.methods.renew = function() {
  if (this.type === REFERRAL_TYPES.PERMANENT) {
    const daysInMs = REFERRAL_LIMITS.PERMANENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
    this.dateDebut = new Date();
    this.dateFin = new Date(Date.now() + daysInMs);
  }
  return this;
};

referralSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this;
};

referralSchema.methods.isExpiringSoon = function() {
  if (!this.dateFin) return false;

  const now = new Date();
  const endDate = new Date(this.dateFin);
  const daysUntilExpiration = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  return daysUntilExpiration > 0 && daysUntilExpiration <= REFERRAL_LIMITS.EXPIRATION_WARNING_DAYS;
};

referralSchema.methods.getDaysUntilExpiration = function() {
  if (!this.dateFin) return null;

  const now = new Date();
  const endDate = new Date(this.dateFin);
  const daysUntilExpiration = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  return daysUntilExpiration;
};

referralSchema.methods.getLocalizedDescription = function(language = 'fr') {
  if (!this.description) return '';
  
  // Handle legacy string descriptions
  if (typeof this.description === 'string') {
    return this.description;
  }
  
  // Handle multilingual object descriptions
  if (typeof this.description === 'object' && this.description !== null) {
    return this.description[language] || 
           this.description.fr || 
           this.description.en || 
           Object.values(this.description).find(desc => desc && typeof desc === 'string') || '';
  }
  
  return '';
};

module.exports = mongoose.model('Referral', referralSchema);
