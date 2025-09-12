const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');

const {
  getAllReferrals,
  createReferral,
  deleteReferral,
  getReferralsbyServiceId,
  getAllReferralsbyUserid,
  getReferralsWithPromoStatus
} = require('../controllers/referralController');

const { updateReferral } = require('../controllers/adminController'); // importer ici
router.get('/user/:id',getAllReferralsbyUserid); // route pour récupérer les referrals par utilisateur
router.get('/service/:id', getReferralsbyServiceId); // route pour récupérer les referrals par service
router.get('/', getAllReferrals);
router.post('/', createReferral);
router.delete('/:id', adminAuthMiddleware, deleteReferral);
router.put('/:id', adminAuthMiddleware, updateReferral);  
router.get('/with-status', getReferralsWithPromoStatus); // nouvelle route pour obtenir les referrals avec leur statut de promotion

module.exports = router;
