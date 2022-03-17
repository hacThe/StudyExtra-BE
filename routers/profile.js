const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.post('/getUserCourse', AccountController.getYourCourses);

module.exports = router;