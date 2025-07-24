const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/auth');


// Submit a report
router.post('/', authMiddleware,reportController.createReport);

// Get all reports
router.get('/', reportController.getAllReports);
router.get('/pending', reportController.getPendingReports);

module.exports = router;
