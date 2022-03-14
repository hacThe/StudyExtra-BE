const express = require('express');
const router = express.Router();

const documentController = require('../controllers/document');

router.get('/', documentController.getAllDocument);

module.exports = router;