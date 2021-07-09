const express = require('express');
const router = express.Router();
const { createPreset, deletePreset, getTimes } = require('../controllers/presets');
const { authorizeToken, isAdmin } = require('../middlewares');

router.post('/presets', authorizeToken, isAdmin, createPreset);
router.delete('/presets/:p_id', authorizeToken, isAdmin, deletePreset);
router.get('/presets/times', getTimes);

module.exports = router;