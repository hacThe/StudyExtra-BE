const express = require('express');
const router = express.Router();

const documentController = require('../controllers/document');

router.get('/', documentController.getAllDocument);
router.post('/', documentController.addNewDocument);
router.delete('/', documentController.deleteDocuments);
router.put('/', documentController.editDocument);
module.exports = router; 