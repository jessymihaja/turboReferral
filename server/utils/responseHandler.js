const { t } = require('./i18n');

class ResponseHandler {
  static success(res, data, message = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message: message || t('success.success'),
      data,
    });
  }

  static created(res, data, message = null) {
    return this.success(res, data, message || t('success.created'), 201);
  }

  static error(res, message = null, statusCode = 500, errors = null) {
    const response = {
      success: false,
      message: message || t('errors.serverError'),
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static badRequest(res, message = null, errors = null) {
    return this.error(res, message || t('errors.badRequest'), 400, errors);
  }

  static unauthorized(res, message = null) {
    return this.error(res, message || t('errors.unauthorized'), 401);
  }

  static forbidden(res, message = null) {
    return this.error(res, message || t('errors.forbidden'), 403);
  }

  static notFound(res, message = null) {
    return this.error(res, message || t('errors.resourceNotFound'), 404);
  }
}

module.exports = ResponseHandler;
