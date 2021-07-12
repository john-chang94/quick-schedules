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
    getUserAvailabilityAndRequests,
    getUsersAndAvailability,
    getAllUsersSchedulesByDate,
} = require('../controllers/users');

router.get('/users', authorizeToken, isAdmin, getAllUsers);
router.get('/users/:u_id', authorizeToken, getUserById);
router.put('/users/:u_id', authorizeToken, editUserGeneral);
router.put('/users/reset-pw/:u_id', authorizeToken, editUserPassword);
router.put('/users/system/:u_id', authorizeToken, isAdmin, editUserSystem);
router.delete('/users/:u_id', authorizeToken, isAdmin, deleteUser);
router.post('/users/availability', authorizeToken, isAdmin, addAdvailability);
router.put('/users/availability/:u_id', authorizeToken, isAdmin, editAvailability);
router.put('/users/availability/notes/:u_id', authorizeToken, isAdmin, editAvailabilityNotes);
router.get('/users/availability/all', getUsersAndAvailability);
router.get('/users/availability/shifts/:start_date/:end_date', getAllUsersSchedulesByDate);
router.get('/users/availability/requests/:u_id/:week_start/:week_end', authorizeToken, isAdmin, getUserAvailabilityAndRequests);

module.exports = router;