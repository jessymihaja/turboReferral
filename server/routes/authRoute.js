const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authValidators } = require('../utils/validators');

router.post('/register', authValidators.register, register);
router.post('/login', authValidators.login, login);

module.exports = router;