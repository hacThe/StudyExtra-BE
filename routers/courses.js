const express = require('express');
const router = express.Router();
const {AuthMiddleware} = require('../helper/JWT');

const coursesController = require('../controllers/CoursesController');

router.post('/new', coursesController.create)
router.get('/getAllCourses', coursesController.getAllCourses);
router.get('/getCourseInfomation', coursesController.getCourseInfomation);
router.post('/update/:id', coursesController.update)
router.get('/:id', coursesController.getOne)
router.delete('/:id', coursesController._delete)
module.exports = router;