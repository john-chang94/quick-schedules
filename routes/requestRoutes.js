const express = require('express');
const router = express.Router();
const { createRequest } = require('../controllers/requests');
const { authorizeToken, isAdmin } = require('../middlewares');

router.post('/requests', authorizeToken, createRequest);

module.exports = router;