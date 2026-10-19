const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  getAllWorkCenters,
  getWorkCenterById,
  createWorkCenter,
  updateWorkCenter,
  deleteWorkCenter
} = require('../controllers/workcenters.controller');

// All routes require authentication
router.use(authenticateToken);

// GET /api/work-centers - Get all work centers
router.get('/', getAllWorkCenters);

// GET /api/work-centers/:id - Get single work center
router.get('/:id', getWorkCenterById);

// POST /api/work-centers - Create new work center
router.post('/', createWorkCenter);

// PUT /api/work-centers/:id - Update work center
router.put('/:id', updateWorkCenter);

// DELETE /api/work-centers/:id - Delete work center
router.delete('/:id', deleteWorkCenter);

module.exports = router;
