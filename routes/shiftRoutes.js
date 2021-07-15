const express = require('express');
const router = express.Router();
const { authorizeToken, isAdmin } = require('../middlewares');
const {
    createShift,
    editShift,
    deleteShift,
    getShiftsByUser,
    getShiftsByDate,
    getAllShifts,
    getAllUsersSchedulesByDate
} = require('../controllers/shifts');

router.get('/shifts', getAllShifts);
router.get('/shifts/:start_date/:end_date', getShiftsByDate);
router.get('/shifts/all/:start_date/:end_date', getAllUsersSchedulesByDate);
router.get('/shifts/:u_id/:shift_start/:shift_end', getShiftsByUser);
router.post('/shifts', authorizeToken, isAdmin, createShift);
router.put('/shifts/:s_id', authorizeToken, isAdmin, editShift);
router.delete('/shifts/:s_id', authorizeToken, isAdmin, deleteShift);

module.exports = router;