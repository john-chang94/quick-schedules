const express = require('express');
const router = express.Router();
const { register, signIn, verifyUser } = require('../controllers/auth');
const { authorizeToken, registerValidator } = require('../middlewares');

router.post('/auth/register', authorizeToken, registerValidator, register);
router.post('/auth/signin', signIn);
router.get('/auth/verify', authorizeToken, verifyUser);

module.exports = router;