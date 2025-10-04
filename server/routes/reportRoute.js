const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { reportValidators, idValidator } = require('../utils/validators');

const {
  createReport,
  getAllReports,
  getPendingReports,
  ignoreReport,
} = require('../controllers/reportController');

router.post('/', authenticateToken, reportValidators.create, createReport);
router.get('/', adminAuthMiddleware, getAllReports);
router.get('/pending', adminAuthMiddleware, getPendingReports);
router.put('/:id/ignore', adminAuthMiddleware, idValidator, ignoreReport);

module.exports = router;
