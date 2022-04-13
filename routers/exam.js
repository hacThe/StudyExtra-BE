const {AuthMiddleware} = require('../helper/JWT');
const express = require('express');
const router = express.Router();

const ExamsController = require('../controllers/ExamsController');


router.get('/getAllExams', ExamsController.getAllExams);
router.post('/getQuestions', AuthMiddleware, ExamsController.getQuestions);
router.post('/getResultExam', ExamsController.getResultExam);


module.exports = router;