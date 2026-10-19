const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentStats,
  scrapEquipment
} = require('../controllers/equipment.controller');

// All routes require authentication
router.use(authenticateToken);

// GET /api/equipment/stats - Get equipment statistics
router.get('/stats', getEquipmentStats);

// GET /api/equipment - Get all equipment with optional filters
router.get('/', getAllEquipment);

// GET /api/equipment/:id - Get single equipment
router.get('/:id', getEquipmentById);

// POST /api/equipment - Create new equipment
router.post('/', createEquipment);

// PUT /api/equipment/:id - Update equipment
router.put('/:id', updateEquipment);

// POST /api/equipment/:id/scrap - Mark equipment as scrapped
router.post('/:id/scrap', scrapEquipment);

// DELETE /api/equipment/:id - Delete equipment
router.delete('/:id', deleteEquipment);

module.exports = router;
