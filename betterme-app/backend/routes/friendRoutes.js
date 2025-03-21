const express = require('express');
const router = express.Router();
const {getFriends,addFriend,compareIncome} = require('../controllers/friendController');

router.post('/get-friends', getFriends);
router.post('/add-friend', addFriend);
router.get('/compare-income',  compareIncome);

module.exports = router;
