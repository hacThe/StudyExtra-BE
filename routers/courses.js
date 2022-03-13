const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/CoursesController');

router.get('/getAllCourses', coursesController.getAllCourses);

module.exports = router;