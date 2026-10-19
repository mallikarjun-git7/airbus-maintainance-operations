const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  getScheduledRequests
} = require('../controllers/requests.controller');

// All routes require authentication
router.use(authenticateToken);

// GET /api/requests/scheduled - Get scheduled requests for calendar
router.get('/scheduled', getScheduledRequests);

// GET /api/requests - Get all requests with optional filters
router.get('/', getAllRequests);

// GET /api/requests/:id - Get single request
router.get('/:id', getRequestById);

// POST /api/requests - Create new request
router.post('/', createRequest);

// PUT /api/requests/:id - Update request
router.put('/:id', updateRequest);

// DELETE /api/requests/:id - Delete request
router.delete('/:id', deleteRequest);

module.exports = router;
