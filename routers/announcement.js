
const express = require('express');
const router = express.Router();
const AnnouncementController = require('../controllers/AnnouncementController');

router.get('/getAllAnnouncement', AnnouncementController.getAllAnnouncement);
router.get('/:slug', AnnouncementController.getOneAnnoucement)
module.exports = router;