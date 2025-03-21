const express = require('express');
const router = express.Router();
const {getDashboard, addTransaction, getTransactions, getFriendsAnalytics} = require('../controllers/dashboardController');

router.post('/getDashboard', getDashboard);
router.post('/addTransaction', addTransaction)
router.post('/getTransactions', getTransactions)
router.post('/getFriendsAnalytics', getFriendsAnalytics)
module.exports = router;