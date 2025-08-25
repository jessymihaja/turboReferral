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
const upload = require('../middlewares/uploadLogo');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/',upload.single('logo'), createService);
router.put('/:id', adminAuthMiddleware,upload.single('logo'), updateService);  
router.put('/:id/validate', adminAuthMiddleware, setServiceValidation);

module.exports = router;
