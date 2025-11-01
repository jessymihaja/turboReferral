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
    type: mongoose.Schema.Types.Mixed, // Allows both String and Object
    required: [true, t('validation.nameRequired')],
    validate: {
      validator: function(value) {
        if (!value) return false;
        
        if (typeof value === 'string') {
          return value.trim().length > 0;
        } else if (typeof value === 'object' && value !== null) {
          // At least one language must have a name
          return Object.values(value).some(name => 
            typeof name === 'string' && name.trim().length > 0
          );
        }
        return false;
      },
      message: t('validation.nameRequired')
    }
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

serviceSchema.methods.getLocalizedName = function(language = 'fr') {
  if (!this.name) return '';
  
  // Handle legacy string names
  if (typeof this.name === 'string') {
    return this.name;
  }
  
  // Handle multilingual object names
  if (typeof this.name === 'object' && this.name !== null) {
    return this.name[language] || 
           this.name.fr || 
           this.name.en || 
           Object.values(this.name).find(name => name && typeof name === 'string') || '';
  }
  
  return '';
};

serviceSchema.methods.getLocalizedDescription = function(language = 'fr') {
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

module.exports = mongoose.model('Service', serviceSchema);
