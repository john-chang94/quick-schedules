const express = require('express');
const { authorizeToken, isAdmin } = require('../middlewares');
const { getUserById, getAllUsers, editUserGeneral, editUserPassword, editUserSystem } = require('../controllers/users');
const router = express.Router();

router.get('/users', authorizeToken, getAllUsers);
router.get('/users/:u_id', authorizeToken, getUserById);
router.put('/users/:u_id', authorizeToken, editUserGeneral);
router.put('/users/reset-pw/:u_id', authorizeToken, editUserPassword);
router.put('/users/system/:u_id', authorizeToken, isAdmin, editUserSystem);

module.exports = router;