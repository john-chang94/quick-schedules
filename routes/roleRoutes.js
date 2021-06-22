const express = require('express');
const router = express.Router();
const { getRoles, createRole, updateRole, deleteRole } = require('../controllers/roles');

router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:role_id', updateRole);
router.delete('/roles/:role_id', deleteRole);

module.exports = router;