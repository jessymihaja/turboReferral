const express = require('express');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const router = express.Router();

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  setServiceValidation,
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.put('/:id', adminAuthMiddleware, updateService);  // Ici updateService
router.put('/:id/validate', adminAuthMiddleware, setServiceValidation);

module.exports = router;
