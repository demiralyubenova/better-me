const express = require('express');
const router = express.Router();
const { finishquiz } = require('../controllers/quizController');

router.post('/finishquiz', finishquiz);

module.exports = router;