const express = require('express');
const router = express.Router();
const {getDashboard, addTransaction, getTransactions} = require('../controllers/dashboardController');

router.post('/getDashboard', getDashboard);
router.post('/addTransaction', addTransaction)
router.post('/getTransactions', getTransactions)
module.exports = router;