
const PromReferral = require("../models/PromReferral");


exports.createPromReferral = async (req, res) => {
  try {
    const { referralId, dateDebut, dateFin } = req.body;

    if (!referralId || !dateDebut || !dateFin) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const promReferral = new PromReferral({
      referral: referralId,
      dateDebut,
      dateFin,
    });

    await promReferral.save();
    res.status(201).json(promReferral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Liste des promotions actives (dateDebut <= aujourd’hui <= dateFin)
exports.getActivePromReferrals = async (req, res) => {
  try {
    const today = new Date();

    const activePromotions = await PromReferral.find({
      dateDebut: { $lte: today },
      dateFin: { $gte: today },
    }).populate("referral"); 

    res.json(activePromotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
