const express = require('express');
const router = express.Router();
const { createRequest, addRequestDays, getRequestsByUserAndDate, getRequestsByDateAndLater, editRequestStatus, deleteRequest, deleteRequestDays } = require('../controllers/requests');
const { authorizeToken, isAdmin } = require('../middlewares');

router.post('/requests', authorizeToken, createRequest);
router.post('/request_days', authorizeToken, addRequestDays);
router.get('/requests/:u_id/:date', getRequestsByUserAndDate);
router.get('/requests/:date', isAdmin, getRequestsByDateAndLater);
router.put('/requests/:r_id', authorizeToken, isAdmin, editRequestStatus);
router.delete('/requests/:r_id', authorizeToken, deleteRequest);
router.delete('/request_days/:r_id', authorizeToken, deleteRequestDays);

module.exports = router;