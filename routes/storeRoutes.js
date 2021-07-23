const express = require('express');
const router = express.Router();
const { addStoreHours, editStoreHours, getStoreHours } = require('../controllers/stores');
const { authorizeToken } = require('../middlewares');

router.get('/store', getStoreHours);
router.post('/store', authorizeToken, addStoreHours);
router.put('/store', editStoreHours);

module.exports = router;