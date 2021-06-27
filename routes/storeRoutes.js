const express = require('express');
const router = express.Router();
const { addStoreHours, editStoreHours } = require('../controllers/stores');
const { authorizeToken, isAdmin } = require('../middlewares');

router.post('/store', authorizeToken, isAdmin, addStoreHours);
router.put('/store', authorizeToken, isAdmin, editStoreHours);

module.exports = router;