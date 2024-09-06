const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, authorizeUser } = require('../controllers/userController');

router.post('/register-user', registerUser);

router.post('/verify-user', verifyUser);

router.post('/authorize-user', authorizeUser);

module.exports = router;