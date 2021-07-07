const express = require('express');
const router = express.Router();
const { createUser, signIn, verifyUser } = require('../controllers/auth');
const { authorizeToken, createUserValidator } = require('../middlewares');

router.post('/auth/register', authorizeToken, createUserValidator, createUser);
router.post('/auth/signin', signIn);
router.get('/auth/verify', authorizeToken, verifyUser);

module.exports = router;