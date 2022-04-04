const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get('/getUserCourses', AccountController.getUserCourses);

module.exports = router;