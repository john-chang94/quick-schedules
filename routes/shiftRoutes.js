const express = require('express');
const router = express.Router();
const { authorizeToken, isAdmin } = require('../middlewares');
const {
    createShift,
    editShift,
    deleteShift,
    getShiftsByUser,
    getShiftsByDates,
    getAllShifts,
    getAllUsersSchedulesByDate,
    getDatesForNullShifts
} = require('../controllers/shifts');

router.get('/shifts', getAllShifts);
router.get('/shifts/:start_date', getDatesForNullShifts);
router.get('/shifts/:start_date/:end_date', getShiftsByDates);
router.get('/shifts/:u_id/:shift_start/:shift_end', authorizeToken, getShiftsByUser);
// router.get('/shifts/:start_date/:end_date', getAllUsersSchedulesByDate);
router.post('/shifts', authorizeToken, isAdmin, createShift);
router.put('/shifts/:s_id', authorizeToken, isAdmin, editShift);
router.delete('/shifts/:s_id', authorizeToken, isAdmin, deleteShift);

module.exports = router;