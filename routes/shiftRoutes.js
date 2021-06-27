const express = require('express');
const router = express.Router();
const { createShift, editShift, deleteShift, getShiftsByUser, getShiftsByDates } = require('../controllers/shifts');
const { authorizeToken, isAdmin } = require('../middlewares');

router.get('/shifts/:shift_start/:shift_end', authorizeToken, getShiftsByDates);
router.get('/shifts/:u_id/:shift_start/:shift_end', authorizeToken, getShiftsByUser);
router.post('/shifts', authorizeToken, isAdmin, createShift);
router.put('/shifts/:s_id', authorizeToken, isAdmin, editShift);
router.delete('/shifts/:s_id', authorizeToken, isAdmin, deleteShift);

module.exports = router;