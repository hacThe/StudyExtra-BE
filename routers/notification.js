const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/NotificationController');

router.post('/getYourNotification', NotificationController.getYourNotification);
router.post('/createNotification', NotificationController.createNotification);

module.exports = router;