const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadLogo');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { authenticateToken } = require('../middlewares/auth');
const { serviceValidators, idValidator } = require('../utils/validators');

const {
  getAllServices,
  getServiceById,
  createService,
  setServiceValidation,
  updateService,
  getUserServices,
  deleteService,
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/user/my-services', authenticateToken, getUserServices);
router.get('/:id', idValidator, getServiceById);
router.post(
  '/',
  authenticateToken,
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
router.delete(
  '/:id',
  adminAuthMiddleware,
  idValidator,
  deleteService
);

module.exports = router;
