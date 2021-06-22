const express = require('express');
const router = express.Router();
const { createUser, signIn, verifyUser, authorizeToken } = require('../controllers/auth');

router.post('/auth/register', createUser);
router.post('/auth/signin', signIn);
router.get('/auth/verify', authorizeToken, verifyUser); // Verify signed-in user on page load

module.exports = router;