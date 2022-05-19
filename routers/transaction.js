const express = require('express');
const {AuthMiddleware} = require('../helper/JWT');
const router = express.Router();

const TransactionController = require('../controllers/TransactionController');

router.post('/createDepositRequest', AuthMiddleware,  TransactionController.createDepositRequest);
router.get('/getUserTransaction',  AuthMiddleware,   TransactionController.getUserTransaction);

module.exports = router;