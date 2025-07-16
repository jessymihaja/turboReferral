const ReferralVote = require('../models/ReferralVote');

exports.submitVote = async (req, res) => {
  try {
    const { referralId } = req.params;
    const { vote, comment } = req.body;

    if (!['good', 'bad'].includes(vote)) {
      return res.status(400).json({ message: 'Vote invalide.' });
    }

    const existing = await ReferralVote.findOne({ referral: referralId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà voté pour ce referral.' });
    }

    const newVote = new ReferralVote({
      referral: referralId,
      user: req.user._id,
      vote,
      comment
    });

    await newVote.save();
    res.status(201).json({ message: 'Vote enregistré avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
