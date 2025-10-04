const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { referralValidators, idValidator } = require('../utils/validators');

const {
  getAllReferrals,
  createReferral,
  deleteReferral,
  getReferralsByServiceId,
  getReferralsByUserId,
  getReferralsWithPromoStatus,
} = require('../controllers/referralController');

const { updateReferral } = require('../controllers/adminController');

router.get('/with-status', getReferralsWithPromoStatus);
router.get('/user/:id', idValidator, getReferralsByUserId);
router.get('/service/:id', idValidator, getReferralsByServiceId);
router.get('/', getAllReferrals);
router.post('/', authenticateToken, referralValidators.create, createReferral);
router.put('/:id', adminAuthMiddleware, idValidator, updateReferral);
router.delete('/:id', adminAuthMiddleware, idValidator, deleteReferral);

module.exports = router;
