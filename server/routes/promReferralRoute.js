
const express = require("express");
const router = express.Router();
const promReferralController = require("../controllers/promReferralController");

// Créer une promotion
router.post("/", promReferralController.createPromReferral);

// Liste des promotions actives
router.get("/active", promReferralController.getActivePromReferrals);
// Liste des promotions actives par service ID
router.get("/active/service/:id", promReferralController.getActivePromReferralsbyServiceId);

module.exports = router;
