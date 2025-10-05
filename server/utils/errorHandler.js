const { nodeEnv } = require('../config/env');
const { t } = require('./i18n');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = new AppError(t('errors.resourceNotFound'), 404);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(t('errors.alreadyExists', { field }), 400);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError(t('errors.invalidToken'), 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError(t('errors.tokenExpired'), 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || t('errors.serverError');

  res.status(statusCode).json({
    success: false,
    message,
    ...(nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };
