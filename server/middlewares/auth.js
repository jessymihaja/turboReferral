const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');
const { ROLES } = require('../config/constants');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return ResponseHandler.unauthorized(res, 'Token manquant');
  }

  const decoded = jwt.verify(token, jwtSecret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return ResponseHandler.unauthorized(res, 'Utilisateur non trouvé');
  }

  req.user = user;
  next();
});

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHandler.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return ResponseHandler.forbidden(res, 'Accès refusé');
    }

    next();
  };
};

const requireAdmin = requireRole(ROLES.ADMIN);

module.exports = { authenticateToken, requireRole, requireAdmin };
