const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth'); // middleware JWT
const { createServiceRequest } = require('../controllers/serviceRequestController');

router.post('/service-requests', authenticateToken, createServiceRequest);

module.exports = router;
