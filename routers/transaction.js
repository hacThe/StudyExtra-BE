const express = require('express');
const {AuthMiddleware} = require('../helper/JWT');
const router = express.Router();

const TransactionController = require('../controllers/TransactionController');

router.post('/createDepositRequest', AuthMiddleware,  TransactionController.createDepositRequest);

module.exports = router;