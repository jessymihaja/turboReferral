const { body, param, validationResult } = require('express-validator');
const { VALIDATION } = require('../config/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
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
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  login: [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
};

const referralValidators = {
  create: [
    body('service').isMongoId().withMessage('Invalid service ID'),
    body('link')
      .optional()
      .trim()
      .matches(VALIDATION.URL_REGEX)
      .withMessage('Invalid URL format'),
    body('code').optional().trim().notEmpty().withMessage('Code cannot be empty'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: VALIDATION.MAX_DESCRIPTION_LENGTH })
      .withMessage(`Description must not exceed ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`),
    validate,
  ],
};

const serviceValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('description').optional().trim(),
    body('website')
      .optional()
      .trim()
      .matches(VALIDATION.URL_REGEX)
      .withMessage('Invalid website URL'),
    body('category').isMongoId().withMessage('Invalid category ID'),
    validate,
  ],
};

const voteValidators = {
  create: [
    body('referral').isMongoId().withMessage('Invalid referral ID'),
    body('vote').isIn(['good', 'bad']).withMessage('Vote must be either "good" or "bad"'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: VALIDATION.MAX_COMMENT_LENGTH })
      .withMessage(`Comment must not exceed ${VALIDATION.MAX_COMMENT_LENGTH} characters`),
    validate,
  ],
};

const reportValidators = {
  create: [
    body('referralId').isMongoId().withMessage('Invalid referral ID'),
    body('reason')
      .isIn(['Brisé', 'Trompeur', 'Abusif', 'Autre'])
      .withMessage('Invalid report reason'),
    validate,
  ],
};

const categoryValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().trim(),
    validate,
  ],
};

const idValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
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
};
