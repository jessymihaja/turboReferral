const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

// Route pour inscription
router.post('/register', register);

// Route pour connexion
router.post('/login', login);

module.exports = router;