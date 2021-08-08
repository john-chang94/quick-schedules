const express = require('express');
const router = express.Router();
const { authorizeToken } = require('../middlewares');
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
    getUserAvailabilityAndRequests,
    getAllUsersAndAvailability,
    getUserAvailability,
    addAdvailability2,
    editAvailability2,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:u_id', getUserById);
router.put('/users/:u_id', authorizeToken, editUserGeneral);
router.put('/users/reset-pw/:u_id', authorizeToken, editUserPassword);
router.put('/users/system/:u_id', authorizeToken, editUserSystem);
router.delete('/users/:u_id', authorizeToken, deleteUser);
router.post('/users/availability', addAdvailability2);
router.put('/users/availability/:a_id', editAvailability2);
router.put('/users/availability/notes/:u_id', authorizeToken, editAvailabilityNotes);
router.get('/users/availability/all', getAllUsersAndAvailability);
router.get('/users/availability/:u_id', getUserAvailability);
router.get('/users/availability/requests/:u_id/:week_start/:week_end', getUserAvailabilityAndRequests);

module.exports = router;