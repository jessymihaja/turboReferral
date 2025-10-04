const { authenticateToken, requireAdmin } = require('./auth');

const adminAuthMiddleware = [authenticateToken, requireAdmin];

module.exports = adminAuthMiddleware;
