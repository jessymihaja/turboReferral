const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadLogo');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { serviceValidators, idValidator } = require('../utils/validators');

const {
  getAllServices,
  getServiceById,
  createService,
  setServiceValidation,
  updateService,
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', idValidator, getServiceById);
router.post(
  '/',
  upload.single('logo'),
  serviceValidators.create,
  createService
);
router.patch(
  '/:id/validate',
  adminAuthMiddleware,
  idValidator,
  setServiceValidation
);
router.put(
  '/:id',
  adminAuthMiddleware,
  upload.single('logo'),
  idValidator,
  updateService
);

module.exports = router;
