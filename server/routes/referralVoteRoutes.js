const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const { submitVote } = require('../controllers/referralVoteController');

router.post('/:referralId/vote',authMiddleware, submitVote);

module.exports = router;
