const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const dashboardRouter = express.Router();

// Get dashboard statistics
dashboardRouter.get('/stats', [authMiddleware, adminMiddleware], dashboardController.getDashboardStats);

module.exports = dashboardRouter;