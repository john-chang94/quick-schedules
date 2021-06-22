const express = require('express');
const router = express.Router();
const { getRoles, createRole } = require('../controllers/roles');

router.get('/roles', getRoles);
router.get('/roles', createRole);

module.exports = router;