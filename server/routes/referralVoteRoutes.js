const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { voteValidators, referralIdValidator } = require('../utils/validators');

const {
  submitVote,
  getCommentsByReferral,
  getAllAverageRatings,
  getAverageRatingByReferral,
  getUserVoteForReferral,
  deleteVote,
} = require('../controllers/referralVoteController');

router.post(
  '/:referralId/vote',
  authenticateToken,
  voteValidators.create,
  submitVote
);
router.delete(
  '/:referralId/vote',
  authenticateToken,
  referralIdValidator,
  deleteVote
);
router.get('/:referralId/comments', referralIdValidator, getCommentsByReferral);
router.get('/averages/all', getAllAverageRatings);
router.get('/averages/:referralId', referralIdValidator, getAverageRatingByReferral);
router.get('/:referralId/user-vote', authenticateToken, referralIdValidator, getUserVoteForReferral);

module.exports = router;
