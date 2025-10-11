const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');
const {
  listServices,
  validateService,
  getStats,
  getAnalytics,
  listUsers,
  getUserDetails,
  blockUser,
  deleteUser,
  updateUserRole
} = require('../controllers/adminController');

router.use(adminAuthMiddleware);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/services', listServices);
router.put('/services/:id/validate', idValidator, validateService);
router.get('/users', listUsers);
router.get('/users/:id', idValidator, getUserDetails);
router.put('/users/:id/block', idValidator, blockUser);
router.put('/users/:id/role', idValidator, updateUserRole);
router.delete('/users/:id', idValidator, deleteUser);

module.exports = router;
