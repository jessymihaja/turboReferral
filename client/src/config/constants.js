export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  SERVICES: {
    BASE: '/api/services',
    BY_ID: (id) => `/api/services/${id}`,
  },
  REFERRALS: {
    BASE: '/api/referrals',
    BY_SERVICE: (id) => `/api/referrals/service/${id}`,
    BY_USER: (id) => `/api/referrals/user/${id}`,
    WITH_STATUS: '/api/referrals/with-status',
  },
  CATEGORIES: {
    BASE: '/api/categories',
  },
  VOTES: {
    SUBMIT: (referralId) => `/api/referralVotes/${referralId}/vote`,
    COMMENTS: (referralId) => `/api/referralVotes/${referralId}/comments`,
    AVERAGES: '/api/referralVotes/averages/all',
    AVERAGE_BY_ID: (referralId) => `/api/referralVotes/averages/${referralId}`,
  },
  REPORTS: {
    BASE: '/api/reports',
    PENDING: '/api/reports/pending',
    IGNORE: (id) => `/api/reports/${id}/ignore`,
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count',
    MARK_READ: (id) => `/api/notifications/${id}/read`,
  },
  PROMOTIONS: {
    ACTIVE: '/api/promotions/active',
    BY_SERVICE: (id) => `/api/promotions/active/service/${id}`,
  },
};

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
};

export const VOTE_TYPES = {
  GOOD: 'good',
  BAD: 'bad',
};

export const REPORT_REASONS = {
  BROKEN: 'Brisé',
  MISLEADING: 'Trompeur',
  ABUSIVE: 'Abusif',
  OTHER: 'Autre',
};
