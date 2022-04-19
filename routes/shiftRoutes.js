const express = require('express');
const router = express.Router();
const { authorizeToken } = require('../middlewares');
const {
    createShift,
    editShift,
    deleteShift,
    getShiftsByUser,
    // getShiftsByDate,
    getAllUsersSchedulesByDate,
    getAllUsersSchedulesByDateMobile,
    copyWeeklySchedule,
    clearWeeklySchedule
} = require('../controllers/shifts');

// router.get('/shifts/:start_date/:end_date', getShiftsByDate);
router.get('/shifts/:start_date/:end_date', getAllUsersSchedulesByDate);
router.get('/shifts/mobile/:start_date/:end_date', getAllUsersSchedulesByDateMobile);
router.get('/shifts/:u_id/:shift_start/:shift_end', getShiftsByUser);
router.post('/shifts', authorizeToken, createShift);
router.post('/shifts/copy', authorizeToken, copyWeeklySchedule);
router.delete('/shifts/clear/:weekStart/:weekEnd', authorizeToken, clearWeeklySchedule);
router.put('/shifts/:s_id', authorizeToken, editShift);
router.delete('/shifts/:s_id', authorizeToken, deleteShift);

module.exports = router;