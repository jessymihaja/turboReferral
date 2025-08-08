const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const { submitVote ,getCommentsByReferral, getAllAverageRatings} = require('../controllers/referralVoteController');

router.post('/:referralId/vote',authMiddleware, submitVote);
router.get('/:referralId/comments', getCommentsByReferral);
router.get('/averages/all', getAllAverageRatings);

module.exports = router;
