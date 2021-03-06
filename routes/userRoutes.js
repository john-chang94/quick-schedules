const express = require('express');
const router = express.Router();
const { authorizeToken, updateUserGeneralValidator, updateUserSystemValidator } = require('../middlewares');
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
    getAllUsersAndAvailability,
    getUserAvailability,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:u_id', getUserById);
router.put('/users/reset-pw/:u_id', authorizeToken, editUserPassword);
router.put('/users/general/:u_id', authorizeToken, updateUserGeneralValidator, editUserGeneral);
router.put('/users/system/:u_id', authorizeToken, updateUserSystemValidator, editUserSystem);
router.delete('/users/:u_id', authorizeToken, deleteUser);
router.post('/users/availability', authorizeToken, addAdvailability);
router.put('/users/availability/:a_id', authorizeToken, editAvailability);
router.put('/users/availability/notes/:u_id', authorizeToken, editAvailabilityNotes);
router.get('/users/availability/all', getAllUsersAndAvailability);
router.get('/users/availability/:u_id', getUserAvailability);

module.exports = router;