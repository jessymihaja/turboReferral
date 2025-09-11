
const express = require("express");
const router = express.Router();
const promReferralController = require("../controllers/promReferralController");

// Créer une promotion
router.post("/", promReferralController.createPromReferral);

// Liste des promotions actives
router.get("/active", promReferralController.getActivePromReferrals);

module.exports = router;
