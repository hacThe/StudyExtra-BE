const {AuthMiddleware} = require('../helper/JWT');
const express = require('express');
const router = express.Router();

const ExamsController = require('../controllers/ExamsController');


router.post('/delete-test-exam', ExamsController.deleteExam)
router.post('/save-test-exam', ExamsController.saveExam)
router.get('/edit/:id', ExamsController.getExamEdit)
router.post('/checkExamRequirement', AuthMiddleware, ExamsController.checkExamRequirement)
router.post('/postResultExam', AuthMiddleware, ExamsController.postResultExam)
router.get('/getAllTestExam', ExamsController.getAllTestExam)
router.post('/addNewExam', ExamsController.addNewExam)
router.get('/getExam/:id', ExamsController.getExam)

module.exports = router;