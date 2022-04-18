const express = require('express');
const router = express.Router();
const { createPreset, deletePreset, getPresets } = require('../controllers/presets');
const { authorizeToken } = require('../middlewares');

router.get('/presets', getPresets);
router.post('/presets', authorizeToken, createPreset);
router.delete('/presets/:p_id', authorizeToken, deletePreset);

module.exports = router;