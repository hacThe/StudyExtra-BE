const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

router.get('/', ArticleController.getAllArticles);
router.post('/', ArticleController.addArticles);
router.put('/', ArticleController.editArticle);
router.delete('/', ArticleController.deleteArticles);

router.post('/comment', ArticleController.addBigComment);
router.delete('/comment', ArticleController.deleteBigComment);
router.post('/comment/hide', ArticleController.hideBigComment);
router.post('/comment/show', ArticleController.showBigComment);
router.post('/comment/interaction', ArticleController.interactBigComment);

router.post('/interaction', ArticleController.interactArticle);
router.delete('/interaction', ArticleController.unlikeArticle);



module.exports = router;