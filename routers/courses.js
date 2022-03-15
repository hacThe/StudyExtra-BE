const express = require('express');
const router = express.Router();
const {AuthMiddleware} = require('../helper/JWT');

const coursesController = require('../controllers/CoursesController');

router.get('/getAllCourses', coursesController.getAllCourses);
router.get('/getCourseInfomation', coursesController.getCourseInfomation)
module.exports = router;