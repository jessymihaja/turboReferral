const { body, param, validationResult } = require('express-validator');
const { VALIDATION } = require('../config/constants');
const { t } = require('./i18n');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages,
      errors: errors.array(),
    });
  }
  next();
};

const authValidators = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage(t('validation.usernameMinLength', { min: 3, max: 30 }))
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(t('validation.usernameInvalid')),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage(t('validation.emailInvalid')),
    body('password')
      .isLength({ min: 6 })
      .withMessage(t('validation.passwordMinLength', { min: 6 })),
    validate,
  ],
  login: [
    body('username').trim().notEmpty().withMessage(t('validation.usernameRequired')),
    body('password').notEmpty().withMessage(t('validation.passwordRequired')),
    validate,
  ],
};

const referralValidators = {
  create: [
    body('service').isMongoId().withMessage(t('validation.serviceRequired')),
    body('link')
      .optional()
      .trim()
      .matches(VALIDATION.URL_REGEX)
      .withMessage(t('validation.linkInvalid')),
    body('code').optional().trim().notEmpty().withMessage(t('validation.linkOrCodeRequired')),
    body('description')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          if (value.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
            throw new Error(t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH }));
          }
        } else if (typeof value === 'object' && value !== null) {
          for (const lang in value) {
            if (typeof value[lang] === 'string' && value[lang].length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
              throw new Error(t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH }));
            }
          }
        }
        return true;
      }),
    validate,
  ],
  update: [
    body('link')
      .optional()
      .trim()
      .matches(VALIDATION.URL_REGEX)
      .withMessage(t('validation.linkInvalid')),
    body('code').optional().trim(),
    body('description')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          if (value.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
            throw new Error(t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH }));
          }
        } else if (typeof value === 'object' && value !== null) {
          for (const lang in value) {
            if (typeof value[lang] === 'string' && value[lang].length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
              throw new Error(t('validation.descriptionMaxLength', { max: VALIDATION.MAX_DESCRIPTION_LENGTH }));
            }
          }
        }
        return true;
      }),
    validate,
  ],
};

const serviceValidators = {
  create: [
    body('name').trim().notEmpty().withMessage(t('validation.nameRequired')),
    body('description').optional().trim(),
    body('website')
      .optional()
      .trim()
      .matches(VALIDATION.URL_REGEX)
      .withMessage(t('validation.linkInvalid')),
    body('category').isMongoId().withMessage(t('validation.categoryRequired')),
    validate,
  ],
};

const voteValidators = {
  create: [
    param('referralId').isMongoId().withMessage(t('validation.referralRequired')),
    body('vote').isIn(['good', 'bad']).withMessage(t('validation.voteTypeInvalid')),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: VALIDATION.MAX_COMMENT_LENGTH })
      .withMessage(t('validation.commentMaxLength', { max: VALIDATION.MAX_COMMENT_LENGTH })),
    validate,
  ],
};

const reportValidators = {
  create: [
    body('referralId').isMongoId().withMessage(t('validation.referralRequired')),
    body('reason')
      .isIn(['Brisé', 'Trompeur', 'Abusif', 'Autre'])
      .withMessage(t('validation.reasonRequired')),
    validate,
  ],
};

const categoryValidators = {
  create: [
    body('name').trim().notEmpty().withMessage(t('validation.nameRequired')),
    body('description').optional().trim(),
    validate,
  ],
};

const idValidator = [
  param('id').isMongoId().withMessage(t('errors.resourceNotFound')),
  validate,
];

const referralIdValidator = [
  param('referralId').isMongoId().withMessage(t('errors.resourceNotFound')),
  validate,
];

module.exports = {
  validate,
  authValidators,
  referralValidators,
  serviceValidators,
  voteValidators,
  reportValidators,
  categoryValidators,
  idValidator,
  referralIdValidator,
};
