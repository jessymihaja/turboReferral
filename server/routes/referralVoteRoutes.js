const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { voteValidators, idValidator } = require('../utils/validators');

const {
  submitVote,
  getCommentsByReferral,
  getAllAverageRatings,
  getAverageRatingByReferral,
} = require('../controllers/referralVoteController');

router.post(
  '/:referralId/vote',
  authenticateToken,
  idValidator,
  voteValidators.create,
  submitVote
);
router.get('/:referralId/comments', idValidator, getCommentsByReferral);
router.get('/averages/all', getAllAverageRatings);
router.get('/averages/:referralId', idValidator, getAverageRatingByReferral);

module.exports = router;
