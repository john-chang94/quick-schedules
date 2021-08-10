const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequestsByUserAndDate,
    getAllRequests,
    editRequestStatus,
    deleteRequest,
    getAllRequestsByStatus,
    getAllRequestsByStatusAndDate,
    getRequestsByUser
} = require('../controllers/requests');
const { authorizeToken } = require('../middlewares');

router.post('/requests', authorizeToken, createRequest);
router.get('/requests', getAllRequests);
router.get('/requests/status/:status', getAllRequestsByStatus);
router.get('/requests/status/:status/:weekStart/:weekEnd', getAllRequestsByStatusAndDate);
router.get('/requests/:u_id', getRequestsByUser);
router.get('/requests/:u_id/:date', getRequestsByUserAndDate);
router.put('/requests/:r_id', editRequestStatus);
router.delete('/requests/:r_id', authorizeToken, deleteRequest);

module.exports = router;