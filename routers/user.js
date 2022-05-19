const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUser);
router.get('/:id', userController.getUser);
router.post('/lock/:id', userController.toogleLockState);
router.delete('/:id', userController._delete )

module.exports = router;