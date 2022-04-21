const {AuthMiddleware} = require('../helper/JWT');
const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');


router.get('/getUserCourses', AuthMiddleware, AccountController.getUserCourses);
router.post('/upLoadAvatar',AuthMiddleware, AccountController.uploadAvatar);

module.exports = router;