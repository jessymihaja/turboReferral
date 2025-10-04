module.exports = {
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  VOTE_TYPES: {
    GOOD: 'good',
    BAD: 'bad',
  },

  REPORT_REASONS: {
    BROKEN: 'Brisé',
    MISLEADING: 'Trompeur',
    ABUSIVE: 'Abusif',
    OTHER: 'Autre',
  },

  REPORT_STATUS: {
    PENDING: 1,
    RESOLVED: 0,
  },

  SERVICE_REQUEST_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },

  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: /jpeg|jpg|png|gif|webp/,
    ALLOWED_MIME_TYPES: /image\/(jpeg|jpg|png|gif|webp)/,
  },

  VALIDATION: {
    MAX_COMMENT_LENGTH: 300,
    MAX_DESCRIPTION_LENGTH: 100,
    URL_REGEX: /^https?:\/\/.+$/,
  },
};
