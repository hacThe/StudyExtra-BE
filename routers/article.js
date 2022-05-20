const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

router.get('/', ArticleController.getAllArticles);
router.post('/', ArticleController.addArticles);
router.delete('/', ArticleController.deleteArticles);

module.exports = router;