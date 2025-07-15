const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');

// Toutes les routes ici sont protégées : token valide + rôle admin
router.use(adminAuthMiddleware);

router.get('/services', adminController.listServices);
router.put('/services/:id/validate', adminController.validateService);


module.exports = router;
