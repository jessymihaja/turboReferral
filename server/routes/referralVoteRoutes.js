const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const { submitVote ,getCommentsByReferral} = require('../controllers/referralVoteController');

router.post('/:referralId/vote',authMiddleware, submitVote);
router.get('/:referralId/comments', getCommentsByReferral);

module.exports = router;
