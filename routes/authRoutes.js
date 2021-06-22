const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/auth');

router.post('/auth/register', createUser);

module.exports = router;