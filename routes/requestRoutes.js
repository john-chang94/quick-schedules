const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequestsByUserAndDate,
    getAllRequests,
    editRequestStatus,
    deleteRequest,
    deleteRequestDays,
    getAllRequestsByStatus,
    getAllRequestsByStatusAndDate
} = require('../controllers/requests');
const { authorizeToken } = require('../middlewares');

router.post('/requests', authorizeToken, createRequest);
router.get('/requests', getAllRequests);
router.get('/requests/:status', getAllRequestsByStatus);
router.get('/requests/:u_id/:date', getRequestsByUserAndDate);
router.get('/requests/:status/:weekStart/:weekEnd', getAllRequestsByStatusAndDate);
router.put('/requests/:r_id', editRequestStatus);
router.delete('/requests/:r_id', authorizeToken, deleteRequest);
router.delete('/request_days/:r_id', authorizeToken, deleteRequestDays);

module.exports = router;