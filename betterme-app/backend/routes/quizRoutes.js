const express = require('express');
const router = express.Router();
const { finishquiz,finishlesson, getlessons } = require('../controllers/quizController');

router.post('/finishquiz', finishquiz);
router.post('/complete-lesson', finishlesson)
router.get('/get-lessons', getlessons)

module.exports = router;