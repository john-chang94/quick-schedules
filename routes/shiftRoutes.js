const express = require('express');
const router = express.Router();
const { authorizeToken } = require('../middlewares');
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
router.post('/shifts', authorizeToken, createShift);
router.put('/shifts/:s_id', authorizeToken, editShift);
router.delete('/shifts/:s_id', authorizeToken, deleteShift);

module.exports = router;