const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');
const { listServices, validateService, getStats, getAnalytics } = require('../controllers/adminController');

router.use(adminAuthMiddleware);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/services', listServices);
router.put('/services/:id/validate', idValidator, validateService);

module.exports = router;
