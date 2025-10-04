const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');
const { listServices, validateService } = require('../controllers/adminController');

router.use(adminAuthMiddleware);

router.get('/services', listServices);
router.put('/services/:id/validate', idValidator, validateService);

module.exports = router;
