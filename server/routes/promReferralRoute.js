const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');

const {
  createPromReferral,
  getActivePromReferrals,
  getActivePromReferralsByServiceId,
  getPromReferralByReferralId,
} = require('../controllers/promReferralController');

router.post('/', adminAuthMiddleware, createPromReferral);
router.get('/active', getActivePromReferrals);
router.get('/active/service/:id', idValidator, getActivePromReferralsByServiceId);
router.get('/by-referral/:id', idValidator, getPromReferralByReferralId);

module.exports = router;
