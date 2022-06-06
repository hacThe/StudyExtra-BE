const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/LessonController');

router.get('/course/:id', lessonController.getCourseInfoByCourseID  );

module.exports = router;