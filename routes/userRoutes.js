const express = require('express');
const router = express.Router();
const { authorizeToken, isAdmin } = require('../middlewares');
const {
    getUserById,
    getAllUsers,
    editUserGeneral,
    editUserPassword,
    editUserSystem,
    deleteUser,
    addAdvailability,
    editAvailability,
    editAvailabilityNotes,
} = require('../controllers/users');

router.get('/users', authorizeToken, getAllUsers);
router.get('/users/:u_id', authorizeToken, getUserById);
router.put('/users/:u_id', authorizeToken, editUserGeneral);
router.put('/users/reset-pw/:u_id', authorizeToken, editUserPassword);
router.put('/users/system/:u_id', authorizeToken, isAdmin, editUserSystem);
router.delete('/users/:u_id', authorizeToken, isAdmin, deleteUser);
router.post('/users/availability', authorizeToken, addAdvailability);
router.put('/users/availability/:u_id', authorizeToken, editAvailability);
router.put('/users/availability/notes/:u_id', authorizeToken, isAdmin, editAvailabilityNotes);

module.exports = router;