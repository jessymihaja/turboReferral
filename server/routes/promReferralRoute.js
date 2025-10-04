const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { idValidator } = require('../utils/validators');

const {
  createPromReferral,
  getActivePromReferrals,
  getActivePromReferralsByServiceId,
} = require('../controllers/promReferralController');

router.post('/', adminAuthMiddleware, createPromReferral);
router.get('/active', getActivePromReferrals);
router.get('/active/service/:id', idValidator, getActivePromReferralsByServiceId);

module.exports = router;
