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


exports.getCommentsByReferral = async (req, res) => {
  try {
    const { referralId } = req.params;
    const comments = await ReferralVote.find({ referral: referralId, comment: { $ne: '' } })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAverageRatings = async (req, res) => {
  try {
    const result = await ReferralVote.aggregate([
      {
        $group: {
          _id: '$referral',
          average: {
            $avg: {
              $cond: [{ $eq: ['$vote', 'good'] }, 1, 0]
            }
          },
          totalVotes: { $sum: 1 }
        }
      }
    ]);

    // Transformer le tableau en objet { referralId: { average, totalVotes } }
    const averagesMap = {};
    result.forEach(r => {
      averagesMap[r._id.toString()] = {
        average: r.average,
        totalVotes: r.totalVotes
      };
    });

    res.json(averagesMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const mongoose = require('mongoose');

exports.getAverageRatingByReferral = async (req, res) => {
  try {
    const { referralId } = req.params;
    const result = await ReferralVote.aggregate([
      { $match: { referral: new mongoose.Types.ObjectId(referralId) } }, // ✅
      {
        $group: {
          _id: '$referral',
          average: {
            $avg: {
              $cond: [{ $eq: ['$vote', 'good'] }, 1, 0],
            },
          },
          totalVotes: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ average: 0, totalVotes: 0 });
    }
    res.json({ average: result[0].average, totalVotes: result[0].totalVotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


