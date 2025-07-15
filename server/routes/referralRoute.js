const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');

const {
  getAllReferrals,
  createReferral,
  deleteReferral,
} = require('../controllers/referralController');

const { updateReferral } = require('../controllers/adminController'); // importer ici

router.get('/', getAllReferrals);
router.post('/', createReferral);
router.delete('/:id', adminAuthMiddleware, deleteReferral);
router.put('/:id', adminAuthMiddleware, updateReferral);  // utiliser la fonction importée

module.exports = router;
