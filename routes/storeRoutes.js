const express = require('express');
const router = express.Router();
const { addStoreHours, editStoreHours, getStoreHours, getTimes } = require('../controllers/stores');
const { authorizeToken } = require('../middlewares');

router.get('/store', getStoreHours);
router.post('/store', authorizeToken, addStoreHours);
router.put('/store', editStoreHours);
router.get('/store/times', getTimes);

module.exports = router;